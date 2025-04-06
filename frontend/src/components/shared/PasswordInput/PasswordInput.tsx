import { LockIcon, ViewIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react"
import { useState } from "react"

interface IPassowrdInputProps {
    isSub: boolean;
}

export const PasswordInput = ({isSub}: IPassowrdInputProps) => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    return (
        <InputGroup size='md'>
            <InputLeftElement>
                <LockIcon />
            </InputLeftElement>
            <Input
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                placeholder='Password'
                disabled={isSub}
                // {...props}
                // borderRadius={radius.full}
                // isInvalid={!!errors}
                // errorBorderColor={errors ? colors.pink : 'gray.300'}
            />
            <InputRightElement width='4.5rem'>
                <ViewIcon onClick={handleClick} cursor='pointer' />
            </InputRightElement>
        </InputGroup>
    )
}