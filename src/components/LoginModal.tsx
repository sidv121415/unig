import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Link,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import backendClient from '../service/backendClient';

export default function LoginModal({ isOpen, onClose }: { isOpen: number, onClose: () => void }) {
    // isOpen is actually a boolean in parent, but let's check standard Chakra
    // Wait, isOpen should be boolean.
    // I will assume parent passes boolean.

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const toast = useToast();

    const handleSubmit = async () => {
        if (!username || !password || (!isLogin && !email)) {
            toast({ title: "Please fill all fields", status: "warning" });
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            toast({ title: "Passwords do not match", status: "error" });
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin) {
                const res = await backendClient.post("/auth/login", { username, password });
                login(res.data.token, { id: res.data.id, username: res.data.username });
                toast({ title: "Welcome back!", status: "success" });
                onClose();
            } else {
                await backendClient.post("/auth/signup", { username, email, password });
                toast({ title: "Account created! Please login.", status: "success" });
                setIsLogin(true);
            }
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.response?.data?.message || err.response?.data || "Something went wrong",
                status: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <Modal isOpen={!!isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
            <ModalContent
                bg="#1a1a2e"
                border="1px solid"
                borderColor="purple.900"
                color="white"
                boxShadow="0 0 40px rgba(128, 90, 213, 0.3)"
                borderRadius="xl"
            >
                <ModalHeader
                    bgGradient="linear(to-r, purple.900, transparent)"
                    borderTopRadius="xl"
                    py={6}
                    fontSize="2xl"
                    fontWeight="bold"
                    letterSpacing="wide"
                >
                    {isLogin ? "Welcome Back" : "Join UniG"}
                </ModalHeader>
                <ModalCloseButton mt={2} />
                <ModalBody py={6}>
                    <VStack spacing={5}>
                        <FormControl>
                            <FormLabel color="gray.400" fontSize="sm">Username</FormLabel>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                bg="blackAlpha.400"
                                border="1px solid"
                                borderColor="whiteAlpha.200"
                                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA" }}
                                placeholder="Enter your username"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel color="gray.400" fontSize="sm">Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                bg="blackAlpha.400"
                                border="1px solid"
                                borderColor="whiteAlpha.200"
                                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA" }}
                                placeholder="Enter your password"
                            />
                        </FormControl>

                        {!isLogin && (
                            <FormControl>
                                <FormLabel color="gray.400" fontSize="sm">Email</FormLabel>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    bg="blackAlpha.400"
                                    border="1px solid"
                                    borderColor="whiteAlpha.200"
                                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA" }}
                                    placeholder="Enter your email"
                                />
                            </FormControl>
                        )}
                        {!isLogin && (
                            <FormControl>
                                <FormLabel color="gray.400" fontSize="sm">Confirm Password</FormLabel>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    bg="blackAlpha.400"
                                    border="1px solid"
                                    borderColor="whiteAlpha.200"
                                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA" }}
                                    placeholder="Re-enter password"
                                />
                            </FormControl>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter flexDirection="column" gap={4} pb={6}>
                    <Button
                        width="100%"
                        colorScheme="purple"
                        size="lg"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        bgGradient="linear(to-r, purple.600, purple.500)"
                        _hover={{ bgGradient: "linear(to-r, purple.500, purple.400)", transform: "translateY(-1px)" }}
                        boxShadow="lg"
                    >
                        {isLogin ? "Login Now" : "Create Account"}
                    </Button>
                    <Text fontSize="sm" color="gray.400">
                        {isLogin ? "New to UniG? " : "Already a member? "}
                        <Link
                            color="purple.300"
                            fontWeight="bold"
                            onClick={() => { setIsLogin(!isLogin); setConfirmPassword(""); }}
                            _hover={{ textDecoration: 'none', color: "white" }}
                        >
                            {isLogin ? "Sign Up Free" : "Login"}
                        </Link>
                    </Text>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
