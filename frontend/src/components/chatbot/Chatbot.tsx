// "use client";

// import { fetcher } from "@/fetchers/fetcher";
// import { IMessage } from "@/typings/Messages.type";
// import { Box, Button, Input, VStack, Text, Flex } from "@chakra-ui/react";
// import { useState } from "react";

// export default function Chatbot() {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = input;

//     setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
//     setInput("");
//     setLoading(true);

//     try {
//       const data = await fetcher<{ reply: string }>(
//         "http://localhost:8080/api/chat",
//         {
//           method: "POST",
//           body: JSON.stringify({ message: userMessage }),
//         },
//       );

//       setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           text: "Sorry, the chatbot is unavailable.",
//         },
//       ]);
//     }

//     setLoading(false);
//   };

//   return (
//     <Flex
//       position="fixed"
//       bottom="20px"
//       right="20px"
//       width="350px"
//       height="500px"
//       bg="white"
//       shadow="lg"
//       borderRadius="lg"
//       p={4}
//       direction="column"
//     >
//       <VStack flex="1" overflowY="auto" spacing={3}>
//         {messages.map((msg, i) => (
//           <Box
//             key={i}
//             alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
//             bg={msg.role === "user" ? "green.200" : "gray.200"}
//             p={2}
//             borderRadius="md"
//             maxW="80%"
//           >
//             <Text fontSize="sm">{msg.text}</Text>
//           </Box>
//         ))}
//       </VStack>

//       <Flex mt={3}>
//         <Input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Ask about landfills..."
//         />
//         <Button
//           ml={2}
//           colorScheme="green"
//           onClick={sendMessage}
//           isLoading={loading}
//         >
//           Send
//         </Button>
//       </Flex>
//     </Flex>
//   );
// }

//======================================================
"use client";

import { fetcher } from "@/fetchers/fetcher";
import { IMessage } from "@/typings/Messages.type";
import {
  Box,
  Input,
  VStack,
  Text,
  Flex,
  IconButton,
  HStack,
  Icon,
  useColorModeValue,
  Collapse,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiMinus,
} from "react-icons/fi";

export default function Chatbot() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── All hooks at top ─────────────────────────────────────────────────────
  const cardBg        = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder    = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  // const cardShadow    = useColorModeValue(
  //   "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
  //   "0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)"
  // );
  const pageBg        = useColorModeValue("#F7F8FA", "#0F1117");
  const subtleText    = useColorModeValue("#6B7280", "#8B92A5");
  const strongText    = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen   = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
  const dividerColor  = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const inputBg       = useColorModeValue("#F9FAFB", "#1E2330");
  const inputBorder   = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.08)");
  const userBubbleBg  = useColorModeValue("#16A34A", "#22C55E");
  const aiBubbleBg    = useColorModeValue("#F3F4F6", "#1E2330");
  const aiBubbleBorder = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const focusShadow   = useColorModeValue(
    "0 0 0 3px rgba(22,163,74,0.15)",
    "0 0 0 3px rgba(34,197,94,0.15)"
  );
  const btnHoverBg    = useColorModeValue("#15803D", "#4ADE80");
  const hoverBg       = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
  // ──────────────────────────────────────────────────────────────────────────

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Track unread messages when closed
  useEffect(() => {
    if (!isOpen && messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      setUnread((prev) => prev + 1);
    }
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnread(0);
  };

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
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, the chatbot is unavailable." },
      ]);
    }

    setLoading(false);
  };

  return (
    <Box position="fixed" bottom="24px" right="24px" zIndex={9999}>

      {/* ── Chat window ─────────────────────────────────────────────────── */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          mb={3}
          w="360px"
          h="520px"
          bg={cardBg}
          border="1px solid"
          borderColor={cardBorder}
          borderRadius="20px"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Box
            px={5} py={4}
            borderBottom="1px solid"
            borderColor={dividerColor}
            bgGradient={useColorModeValue(
              "linear(to-br, white, green.50)",
              "linear(to-br, #171B26, #0F1A12)"
            )}
          >
            <HStack justify="space-between" align="center">
              <HStack spacing={3}>
                <Box
                  w={9} h={9} borderRadius="full"
                  bg={accentGreenSoft}
                  border="1px solid" borderColor={dividerColor}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={FiMessageSquare} color={accentGreen} boxSize={4} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="700" fontSize="sm" color={strongText} letterSpacing="-0.01em">
                    LandFill Assistant
                  </Text>
                  <HStack spacing={1.5}>
                    <Box w={1.5} h={1.5} borderRadius="full" bg="green.400" />
                    <Text fontSize="11px" color={subtleText} fontWeight="500">
                      Online
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <HStack spacing={1}>
                <IconButton
                  aria-label="Minimize"
                  icon={<FiMinus size={14} />}
                  size="sm" variant="ghost"
                  borderRadius="8px"
                  color={subtleText}
                  _hover={{ color: strongText, bg: hoverBg }}
                  onClick={() => setIsOpen(false)}
                />
                <IconButton
                  aria-label="Close"
                  icon={<FiX size={14} />}
                  size="sm" variant="ghost"
                  borderRadius="8px"
                  color={subtleText}
                  _hover={{ color: "red.400", bg: "red.50" }}
                  onClick={() => { setIsOpen(false); setMessages([]); }}
                />
              </HStack>
            </HStack>
          </Box>

          {/* Messages */}
          <VStack
            flex="1"
            overflowY="auto"
            spacing={3}
            px={4} py={4}
            align="stretch"
            bg={pageBg}
            sx={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: dividerColor,
                borderRadius: "4px",
              },
            }}
          >
            {messages.length === 0 && (
              <VStack spacing={3} pt={8} pb={4} textAlign="center">
                <Box
                  w={12} h={12} borderRadius="full" bg={accentGreenSoft}
                  display="flex" alignItems="center" justifyContent="center"
                  mx="auto"
                >
                  <Icon as={FiMessageSquare} color={accentGreen} boxSize={5} />
                </Box>
                <VStack spacing={1}>
                  <Text fontSize="sm" fontWeight="600" color={strongText}>
                    How can I help?
                  </Text>
                  <Text fontSize="xs" color={subtleText} maxW="220px" lineHeight="1.6">
                    Ask me anything about landfill sites, reports, or compliance data.
                  </Text>
                </VStack>
              </VStack>
            )}

            {messages.map((msg, i) => (
              <Flex
                key={i}
                justify={msg.role === "user" ? "flex-end" : "flex-start"}
              >
                <Box
                  maxW="78%"
                  px={3.5} py={2.5}
                  borderRadius={msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px"
                  }
                  bg={msg.role === "user" ? userBubbleBg : aiBubbleBg}
                  border="1px solid"
                  borderColor={msg.role === "user" ? "transparent" : aiBubbleBorder}
                  boxShadow="0 1px 2px rgba(0,0,0,0.06)"
                >
                  <Text
                    fontSize="sm"
                    color={msg.role === "user" ? "white" : strongText}
                    lineHeight="1.6"
                  >
                    {msg.text}
                  </Text>
                </Box>
              </Flex>
            ))}

            {loading && (
              <Flex justify="flex-start">
                <Box
                  px={4} py={3}
                  borderRadius="16px 16px 16px 4px"
                  bg={aiBubbleBg}
                  border="1px solid" borderColor={aiBubbleBorder}
                >
                  <HStack spacing={1}>
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        w={1.5} h={1.5}
                        borderRadius="full"
                        bg={subtleText}
                        animation="pulse 1.2s ease-in-out infinite"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </HStack>
                </Box>
              </Flex>
            )}

            <div ref={messagesEndRef} />
          </VStack>

          {/* Input */}
          <Box
            px={4} py={4}
            borderTop="1px solid" borderColor={dividerColor}
            bg={cardBg}
          >
            <HStack spacing={2}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about landfills…"
                bg={inputBg}
                border="1px solid" borderColor={inputBorder}
                borderRadius="10px"
                fontSize="sm"
                color={strongText}
                _placeholder={{ color: subtleText }}
                _hover={{ borderColor: accentGreen }}
                _focus={{ borderColor: accentGreen, boxShadow: focusShadow, bg: cardBg }}
                transition="all 0.15s"
                size="md"
              />
              <IconButton
                aria-label="Send message"
                icon={<FiSend size={15} />}
                onClick={sendMessage}
                isLoading={loading}
                bg={accentGreen}
                color="white"
                borderRadius="10px"
                size="md"
                flexShrink={0}
                _hover={{
                  bg: btnHoverBg,
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.18s"
              />
            </HStack>
          </Box>
        </Box>
      </Collapse>

      {/* ── Toggle button ───────────────────────────────────────────────── */}
      <Box position="relative" display="inline-block" visibility={isOpen ? "hidden" : "visible"}>
        <IconButton
          aria-label="Open chatbot"
          icon={isOpen
            ? <FiX size={20} />
            : <FiMessageSquare size={20} />
          }
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          w={14} h={14}
          borderRadius="full"
          bg={accentGreen}
          color="white"
          boxShadow="0 4px 20px rgba(22,163,74,0.4)"
          _hover={{
            bg: btnHoverBg,
            transform: "translateY(-2px)",
            boxShadow: "0 8px 28px rgba(22,163,74,0.45)",
          }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.2s"
        />

        {/* Unread badge */}
        {unread > 0 && !isOpen && (
          <Badge
            position="absolute"
            top="-1" right="-1"
            borderRadius="full"
            bg="red.500" color="white"
            fontSize="10px" fontWeight="700"
            minW={5} h={5}
            display="flex" alignItems="center" justifyContent="center"
            border="2px solid" borderColor={cardBg}
          >
            {unread}
          </Badge>
        )}
      </Box>

    </Box>
  );
}