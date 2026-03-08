// import React, { useState } from "react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import {
//   Input,
//   InputGroup,
//   InputLeftElement,
//   InputRightElement,
//   IconButton,
//   useColorModeValue,
//   Icon,
// } from "@chakra-ui/react";
// import { FiLock } from "react-icons/fi";

// interface IPasswordInputProps {
//   isSub: boolean;
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   name?: string;
//   id?: string;
//   isInvalid?: boolean;
//   size?: "sm" | "md" | "lg";
// }

// export const PasswordInput = ({
//   isSub,
//   value,
//   onChange,
//   placeholder = "Enter your password",
//   name = "password",
//   id = "password",
//   isInvalid = false,
//   size = "lg",
// }: IPasswordInputProps) => {
//   const [show, setShow] = useState(false);

//   const bgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
//   const textColor = useColorModeValue("gray.600", "gray.300");
//   const iconColor = useColorModeValue("gray.400", "gray.500");
//   const focusBorderColor = useColorModeValue("green.500", "green.300");
//   const hoverBorderColor = useColorModeValue("green.300", "green.400");
//   const disabledBg = useColorModeValue("gray.50", "gray.700");

//   const handleToggle = () => {
//     if (!isSub) {
//       setShow(!show);
//     }
//   };

//   return (
//     <InputGroup size={size}>
//       <InputLeftElement
//         h={size === "lg" ? "12" : size === "md" ? "10" : "8"}
//         w={size === "lg" ? "12" : size === "md" ? "10" : "8"}
//       >
//         <Icon
//           as={FiLock}
//           color={isSub ? iconColor : iconColor}
//           boxSize={size === "lg" ? 5 : size === "md" ? 4 : 3}
//         />
//       </InputLeftElement>

//       <Input
//         id={id}
//         name={name}
//         type={show ? "text" : "password"}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         disabled={isSub}
//         isInvalid={isInvalid}
//         bg={isSub ? disabledBg : bgColor}
//         borderColor={isInvalid ? "red.300" : borderColor}
//         color={textColor}
//         pl={size === "lg" ? "12" : size === "md" ? "10" : "8"}
//         pr={size === "lg" ? "12" : size === "md" ? "10" : "8"}
//         _hover={{
//           borderColor: isSub
//             ? borderColor
//             : isInvalid
//             ? "red.300"
//             : hoverBorderColor,
//         }}
//         _focus={{
//           borderColor: isInvalid ? "red.500" : focusBorderColor,
//           boxShadow: isInvalid
//             ? "0 0 0 1px var(--chakra-colors-red-500)"
//             : `0 0 0 1px ${focusBorderColor}`,
//           bg: bgColor,
//         }}
//         _disabled={{
//           opacity: 0.6,
//           cursor: "not-allowed",
//           bg: disabledBg,
//         }}
//         _placeholder={{
//           color: useColorModeValue("gray.400", "gray.500"),
//         }}
//         transition="all 0.2s"
//         borderRadius="lg"
//       />

//       <InputRightElement
//         h={size === "lg" ? "12" : size === "md" ? "10" : "8"}
//         w={size === "lg" ? "12" : size === "md" ? "10" : "8"}
//       >
//         <IconButton
//           aria-label={show ? "Hide password" : "Show password"}
//           icon={show ? <ViewOffIcon /> : <ViewIcon />}
//           onClick={handleToggle}
//           variant="ghost"
//           size="sm"
//           color={isSub ? iconColor : iconColor}
//           isDisabled={isSub}
//           _hover={{
//             bg: "transparent",
//             color: isSub ? iconColor : focusBorderColor,
//           }}
//           _focus={{
//             boxShadow: "none",
//           }}
//           _disabled={{
//             opacity: 0.4,
//             cursor: "not-allowed",
//           }}
//           borderRadius="md"
//         />
//       </InputRightElement>
//     </InputGroup>
//   );
// };

import React, { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FiLock } from "react-icons/fi";

interface IPasswordInputProps {
  isSub: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  isInvalid?: boolean;
  size?: "sm" | "md" | "lg";
}

export const PasswordInput = ({
  isSub,
  value,
  onChange,
  placeholder = "Enter your password",
  name = "password",
  id = "password",
  isInvalid = false,
  size = "lg",
}: IPasswordInputProps) => {
  const [show, setShow] = useState(false);

  const cardBg          = useColorModeValue("#FFFFFF", "#171B26");
  const inputBg         = useColorModeValue("#F9FAFB", "#1E2330");
  const inputBorder     = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.08)");
  const strongText      = useColorModeValue("#111827", "#F0F2F7");
  const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
  const iconColor       = useColorModeValue("#9CA3AF", "#6B7280");
  const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
  const focusShadow     = useColorModeValue(
    "0 0 0 3px rgba(22,163,74,0.15)",
    "0 0 0 3px rgba(34,197,94,0.15)"
  );
  const disabledBg      = useColorModeValue("#F3F4F6", "#1A1F2E");

  const elSize = size === "lg" ? "12" : size === "md" ? "10" : "8";
  const iconBox = size === "lg" ? 5 : size === "md" ? 4 : 3;
  const pl = size === "lg" ? "12" : size === "md" ? "10" : "8";

  const handleToggle = () => { if (!isSub) setShow(!show); };

  return (
    <InputGroup size={size}>
      <InputLeftElement h={elSize} w={elSize}>
        <Icon as={FiLock} color={iconColor} boxSize={iconBox} />
      </InputLeftElement>

      <Input
        id={id} name={name}
        type={show ? "text" : "password"}
        value={value} onChange={onChange}
        placeholder={placeholder}
        disabled={isSub} isInvalid={isInvalid}
        bg={isSub ? disabledBg : inputBg}
        borderColor={isInvalid ? "red.300" : inputBorder}
        color={strongText}
        pl={pl} pr={elSize}
        borderRadius="10px"
        _placeholder={{ color: subtleText }}
        _hover={{ borderColor: isSub ? inputBorder : isInvalid ? "red.300" : accentGreen }}
        _focus={{
          borderColor: isInvalid ? "red.500" : accentGreen,
          boxShadow: isInvalid ? "0 0 0 3px rgba(239,68,68,0.15)" : focusShadow,
          bg: cardBg,
        }}
        _disabled={{ opacity: 0.6, cursor: "not-allowed", bg: disabledBg }}
        transition="all 0.15s"
      />

      <InputRightElement h={elSize} w={elSize}>
        <IconButton
          aria-label={show ? "Hide password" : "Show password"}
          icon={show ? <ViewOffIcon /> : <ViewIcon />}
          onClick={handleToggle}
          variant="ghost" size="sm"
          color={iconColor}
          isDisabled={isSub}
          _hover={{ bg: "transparent", color: isSub ? iconColor : accentGreen }}
          _focus={{ boxShadow: "none" }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
          borderRadius="8px"
        />
      </InputRightElement>
    </InputGroup>
  );
};