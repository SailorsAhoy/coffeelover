## Goal
Add private messaging, social-graph actions (follow/friend/block/report) and a notification bell, gated to registered users, with realtime updates.

## What already exists
- `chats`, `chat_participants`, `chat_messages` with RLS + `is_chat_participant()` helper
- `follows`, `friendships` (status: pending/accepted/blocked) with RLS
- `has_role()` for admin checks

## New database objects

### Tables
- `user_blocks` (blocker_user_id, blocked_user_id, reason?) — dedicated, simpler than abusing `friendships.status='blocked'`. Trigger prevents blocking any user with the `admin` role.
- `user_reports` (reporter_user_id, reported_user_id, context_type, context_id, reason, status: open/reviewing/resolved/dismissed, handled_by, resolution_note) — admins see all; shop/roaster owners see reports tied to their own chats.
- `notifications` (user_id, type, title, body, link, data jsonb, read_at, created_at) — single inbox for: `message`, `follow`, `friend_request`, `friend_accepted`, `claim_update`, `report_update`, `system`.

### Functions / triggers
- `get_or_create_dm(other_user uuid)` SECURITY DEFINER → returns chat_id; refuses if either side blocked the other; reuses existing 1:1 chat.
- `mark_chat_read(chat_id uuid)` updates `chat_participants.last_read_at` and clears related `notifications`.
- `notify_on_message` trigger on `chat_messages` → inserts a `notifications` row for every other participant (skipping blockers).
- `notify_on_follow`, `notify_on_friend_request`, `notify_on_friend_accept` triggers.
- `prevent_block_admin` trigger on `user_blocks`.
- `prevent_messaging_blocked` trigger on `chat_messages` — blocks send if any participant pair is blocked in a DM.

### RLS
- `user_blocks`: owner only (SELECT/INSERT/DELETE where `auth.uid() = blocker_user_id`).
- `user_reports`: reporter sees own; admins see all; shop/roaster owners can see reports tied to chats they participate in (via `is_chat_participant`); only admins update status.
- `notifications`: recipient SELECT/UPDATE/DELETE; system inserts via triggers (security-definer functions).

### Realtime
- Add `chat_messages`, `chats`, `chat_participants`, `notifications` to `supabase_realtime` publication.

## Frontend

### Library
- `src/lib/messaging.ts` — `openDmWith(userId)`, `listMyChats()`, `sendMessage()`, `markRead()`, realtime subscribe helpers.
- `src/lib/social.ts` — `follow/unfollow`, `requestFriend/accept/reject`, `block/unblock`, `reportUser()`.
- `src/lib/notifications.ts` — `listMyNotifications()`, `unreadCount()`, `markRead()`, realtime channel.

### Components
- `NotificationBell` in the top bar → popover with unread list, per-item link; auto-clears on read.
- `MessageThread`, `ChatList`, `NewDmButton` in a new `/messages` route.
- `UserActions` (Follow / Friend / Message / Block / Report buttons) — used on user profiles, social map, messaging board.
- Profile dashboard gets new tabs (added to existing `DashboardLayout` for every role):
  - **Friends** (accepted + pending sent/received with accept/reject)
  - **Followers** & **Following**
  - **Blocked**
  - **Messages** (inbox preview, deep-links to `/messages/:chatId`)
- Admin dashboard: `ReportsPanel` to triage `user_reports`.
- Shop/roaster owner dashboards: scoped reports list for their own threads.

### Routing / nav
- New `/messages` and `/messages/:chatId` (auth-gated via `RequireAuth`).
- Bell badge + Messages icon in `Navigation` / `AppSidebar`.
- Anonymous users see "Sign in to message" instead of action buttons.

## Technical details

```text
notifications
├─ trigger on chat_messages (after insert)
├─ trigger on follows (after insert)
├─ trigger on friendships (after insert / status=accepted)
└─ inserted from claims approve/reject (extend existing claims.ts)

realtime
└─ channels: notifications:user_id=eq.<uid>, chat:<chatId>
```

- `get_or_create_dm` uses a CTE: find chat where `is_group=false` and both users are sole participants → reuse; else create chat + 2 participants in one txn.
- Unread badge per chat = `count(chat_messages) where created_at > last_read_at and sender ≠ me`.
- Blocking is symmetric for messaging: trigger checks `EXISTS user_blocks where (blocker, blocked) in either direction among DM participants`.
- Admins are exempt from block via `prevent_block_admin` trigger that raises if target has admin role.
- Notification cleanup: `mark_chat_read(chat_id)` sets `read_at = now()` on all `notifications` with `type='message' and data->>'chat_id' = chat_id`.

## Rollout
1. Migration: new tables, triggers, functions, realtime publication, GRANTs.
2. Lib + hooks.
3. Bell + Messages page + dashboard tabs.
4. Wire user-action buttons on profile pages, social map, messaging board.
5. Admin/owner report panels.
6. Manual smoke test.

Approve and I'll execute step by step.
