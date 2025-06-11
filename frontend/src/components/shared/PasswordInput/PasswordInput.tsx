// import { LockIcon, ViewIcon } from "@chakra-ui/icons";
// import {
//   Input,
//   InputGroup,
//   InputLeftElement,
//   InputRightElement,
// } from "@chakra-ui/react";
// import { useState } from "react";

// interface IPassowrdInputProps {
//   isSub: boolean;
// }

// export const PasswordInput = ({ isSub }: IPassowrdInputProps) => {
//   const [show, setShow] = useState(false);
//   const handleClick = () => setShow(!show);

//   return (
//     <InputGroup size="md">
//       <InputLeftElement>
//         <LockIcon />
//       </InputLeftElement>
//       <Input
//         pr="4.5rem"
//         type={show ? "text" : "password"}
//         placeholder="Password"
//         disabled={isSub}
//       />
//       <InputRightElement width="4.5rem">
//         <ViewIcon onClick={handleClick} cursor="pointer" />
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

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const focusBorderColor = useColorModeValue("green.500", "green.300");
  const hoverBorderColor = useColorModeValue("green.300", "green.400");
  const disabledBg = useColorModeValue("gray.50", "gray.700");

  const handleToggle = () => {
    if (!isSub) {
      setShow(!show);
    }
  };

  return (
    <InputGroup size={size}>
      <InputLeftElement
        h={size === "lg" ? "12" : size === "md" ? "10" : "8"}
        w={size === "lg" ? "12" : size === "md" ? "10" : "8"}
      >
        <Icon
          as={FiLock}
          color={isSub ? iconColor : iconColor}
          boxSize={size === "lg" ? 5 : size === "md" ? 4 : 3}
        />
      </InputLeftElement>

      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isSub}
        isInvalid={isInvalid}
        bg={isSub ? disabledBg : bgColor}
        borderColor={isInvalid ? "red.300" : borderColor}
        color={textColor}
        pl={size === "lg" ? "12" : size === "md" ? "10" : "8"}
        pr={size === "lg" ? "12" : size === "md" ? "10" : "8"}
        _hover={{
          borderColor: isSub
            ? borderColor
            : isInvalid
            ? "red.300"
            : hoverBorderColor,
        }}
        _focus={{
          borderColor: isInvalid ? "red.500" : focusBorderColor,
          boxShadow: isInvalid
            ? "0 0 0 1px var(--chakra-colors-red-500)"
            : `0 0 0 1px ${focusBorderColor}`,
          bg: bgColor,
        }}
        _disabled={{
          opacity: 0.6,
          cursor: "not-allowed",
          bg: disabledBg,
        }}
        _placeholder={{
          color: useColorModeValue("gray.400", "gray.500"),
        }}
        transition="all 0.2s"
        borderRadius="lg"
      />

      <InputRightElement
        h={size === "lg" ? "12" : size === "md" ? "10" : "8"}
        w={size === "lg" ? "12" : size === "md" ? "10" : "8"}
      >
        <IconButton
          aria-label={show ? "Hide password" : "Show password"}
          icon={show ? <ViewOffIcon /> : <ViewIcon />}
          onClick={handleToggle}
          variant="ghost"
          size="sm"
          color={isSub ? iconColor : iconColor}
          isDisabled={isSub}
          _hover={{
            bg: "transparent",
            color: isSub ? iconColor : focusBorderColor,
          }}
          _focus={{
            boxShadow: "none",
          }}
          _disabled={{
            opacity: 0.4,
            cursor: "not-allowed",
          }}
          borderRadius="md"
        />
      </InputRightElement>
    </InputGroup>
  );
};
