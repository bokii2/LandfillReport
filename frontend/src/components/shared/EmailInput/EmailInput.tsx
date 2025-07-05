import {
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FiMail } from "react-icons/fi";

interface IEmailInputProps {
  isSub: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  isInvalid?: boolean;
  size?: "sm" | "md" | "lg";
}

export const EmailInput = ({
  isSub,
  value,
  onChange,
  placeholder = "Enter your email",
  name = "email",
  id = "email",
  isInvalid = false,
  size = "lg",
}: IEmailInputProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const focusBorderColor = useColorModeValue("green.500", "green.300");
  const hoverBorderColor = useColorModeValue("green.300", "green.400");
  const disabledBg = useColorModeValue("gray.50", "gray.700");

  return (
    <InputGroup size={size}>
      <InputLeftElement
        h={size === "lg" ? "12" : size === "md" ? "10" : "8"}
        w={size === "lg" ? "12" : size === "md" ? "10" : "8"}
      >
        <Icon
          as={FiMail}
          color={isSub ? iconColor : iconColor}
          boxSize={size === "lg" ? 5 : size === "md" ? 4 : 3}
        />
      </InputLeftElement>
      <Input
        id={id}
        name={name}
        type="username"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isSub}
        isInvalid={isInvalid}
        bg={isSub ? disabledBg : bgColor}
        borderColor={isInvalid ? "red.300" : borderColor}
        color={textColor}
        pl={size === "lg" ? "12" : size === "md" ? "10" : "8"}
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
    </InputGroup>
  );
};
