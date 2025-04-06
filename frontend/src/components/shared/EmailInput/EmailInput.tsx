import { EmailIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement} from "@chakra-ui/react"

interface IEmailInputProps {
    isSub: boolean;
}

export const EmailInput = ({isSub}: IEmailInputProps) => {
    return (
        <InputGroup size='md'>
            <InputLeftElement>
                <EmailIcon />
            </InputLeftElement>
            <Input
                pr='4.5rem'
                type='email'
                placeholder='Email'
                disabled={isSub}
                // {...props}
                // borderRadius={radius.full}
                // isInvalid={!!errors} 
                // errorBorderColor={errors ? colors.pink : 'gray.300'}
            />
        </InputGroup>
    )
}