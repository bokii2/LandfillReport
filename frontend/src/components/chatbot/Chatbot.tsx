"use client";

import { fetcher } from "@/fetchers/fetcher";
import { IMessage } from "@/typings/Messages.type";
import { Box, Button, Input, VStack, Text, Flex } from "@chakra-ui/react";
import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const data = await fetcher<{ reply: string }>(
        "http://localhost:8080/api/chat",
        {
          method: "POST",
          body: JSON.stringify({ message: userMessage }),
        },
      );

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, the chatbot is unavailable.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <Flex
      position="fixed"
      bottom="20px"
      right="20px"
      width="350px"
      height="500px"
      bg="white"
      shadow="lg"
      borderRadius="lg"
      p={4}
      direction="column"
    >
      <VStack flex="1" overflowY="auto" spacing={3}>
        {messages.map((msg, i) => (
          <Box
            key={i}
            alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
            bg={msg.role === "user" ? "green.200" : "gray.200"}
            p={2}
            borderRadius="md"
            maxW="80%"
          >
            <Text fontSize="sm">{msg.text}</Text>
          </Box>
        ))}
      </VStack>

      <Flex mt={3}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about landfills..."
        />
        <Button
          ml={2}
          colorScheme="green"
          onClick={sendMessage}
          isLoading={loading}
        >
          Send
        </Button>
      </Flex>
    </Flex>
  );
}
