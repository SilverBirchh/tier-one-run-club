import { useState } from "react";
import { motion } from "motion/react";
import { Bot, User, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fakeCoachMessages } from "./fake-data";
import { cn } from "@/lib/utils";

export function CoachDemo() {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
      <CardContent className="p-4">
        {/* Context indicator */}
        <div className="mb-4 flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-primary/5 text-xs font-normal"
          >
            <Sparkles className="mr-1 h-3 w-3 text-primary" />
            Analyzing: Today's Tempo Run
          </Badge>
        </div>

        {/* Chat messages */}
        <div className="space-y-4">
          {fakeCoachMessages.map((message, i) => {
            const isUser = message.role === "user";
            return (
              <motion.div
                key={i}
                className={cn("flex gap-3", isUser && "flex-row-reverse")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                {/* Avatar */}
                <motion.div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                  whileHover={{ scale: 1.1 }}
                >
                  {isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </motion.div>

                {/* Message bubble */}
                <motion.div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                  onHoverStart={() => {
                    if (!isUser) {
                      setIsTyping(true);
                      setTimeout(() => setIsTyping(false), 1500);
                    }
                  }}
                >
                  {!isUser && isTyping ? (
                    <TypingIndicator />
                  ) : (
                    <p className="leading-relaxed">{message.content}</p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Input mockup */}
        <motion.div
          className="mt-4 flex items-center gap-2 rounded-full border border-primary/10 bg-background/50 px-4 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ borderColor: "var(--color-primary)" }}
        >
          <span className="flex-1 text-sm text-muted-foreground">
            Ask about your training...
          </span>
          <motion.div
            className="rounded-full bg-primary p-1.5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-current opacity-60"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
