import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <Flex
            height="100vh"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            textAlign="center"
            px={4}
            position="relative"
            zIndex={2}
        >
            <VStack spacing={6}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <Heading
                        as="h1"
                        fontSize={{ base: "5xl", md: "7xl", lg: "9xl" }}
                        fontWeight="black"
                        letterSpacing="tighter"
                        bgGradient="linear(to-r, white, gray.500)"
                        bgClip="text"
                        lineHeight="0.9"
                        textShadow="0 10px 30px rgba(0,0,0,0.5)"
                        fontFamily="'Orbitron', sans-serif"
                    >
                        NEXT LEVEL
                        <br />
                        GAMING
                    </Heading>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                    <Text
                        fontSize={{ base: "lg", md: "2xl" }}
                        color="gray.400"
                        maxW="800px"
                        fontWeight="medium"
                        textShadow="0 4px 10px rgba(0,0,0,0.8)"
                        fontFamily="'Outfit', sans-serif"
                    >
                        Immerse yourself in a curated universe of top-tier titles.
                        <br />
                        Experience the art of play.
                    </Text>
                </motion.div>
            </VStack>
        </Flex>
    );
};

export default Hero;
