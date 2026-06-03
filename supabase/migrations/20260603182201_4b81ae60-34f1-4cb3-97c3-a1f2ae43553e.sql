
REVOKE EXECUTE ON FUNCTION public.prevent_block_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_blocked_between(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.notify_on_message() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.prevent_messaging_blocked() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.notify_on_follow() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.notify_on_friendship() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_or_create_dm(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_chat_read(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.unread_notifications_count() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_blocked_between(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_dm(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_chat_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unread_notifications_count() TO authenticated;
