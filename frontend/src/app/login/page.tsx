import { Container } from "@chakra-ui/react";
import LoginClientWrapper from "./login-client";


export default function Login() {
    return (
        <Container maxW="container.md" py={10}>
            <LoginClientWrapper />
        </Container>
    );
}