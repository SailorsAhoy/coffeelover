import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search } from "lucide-react";

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: number;
  sender: "user" | "other";
  text: string;
  timestamp: string;
}

const MessagingBoard = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageText, setMessageText] = useState("");

  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "",
      lastMessage: "Thanks for the coffee recommendation!",
      timestamp: "2m ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Coffee Lovers Group",
      avatar: "",
      lastMessage: "Anyone tried the new Ethiopian blend?",
      timestamp: "1h ago",
      unread: 5,
    },
    {
      id: 3,
      name: "Mike Chen",
      avatar: "",
      lastMessage: "Let's meet at the new cafe tomorrow",
      timestamp: "3h ago",
      unread: 0,
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: "other",
      text: "Hey! Have you tried that new roaster downtown?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "Yes! Their Ethiopian blend is amazing",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      sender: "other",
      text: "Thanks for the coffee recommendation!",
      timestamp: "10:35 AM",
    },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText("");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* Conversations List */}
          <Card className="md:col-span-1 h-full flex flex-col">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conv.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {conv.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">{conv.name}</h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {conv.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                            {conv.unread > 0 && (
                              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="md:col-span-2 h-full flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        SJ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Sarah Johnson</h3>
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagingBoard;
