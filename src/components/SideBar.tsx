import { Box, VStack, Text, Link, Icon, useColorModeValue } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { GoArrowUpRight } from "react-icons/go";
import { sampleItems } from "./navData";

interface SideBarProps {
    isVisible: boolean;
    onFilterSelect?: (type: string, value: string | number) => void;
}

const SideBar = ({ isVisible, onFilterSelect }: SideBarProps) => {
    const bg = useColorModeValue("white", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        position: "fixed",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        height: "100vh",
                        width: "250px",
                        zIndex: 99,
                        paddingTop: "80px",
                    }}
                >
                    <Box
                        h="100%"
                        w="100%"
                        bg="black"
                        borderRight="1px solid"
                        borderColor="whiteAlpha.200"
                        p={6}
                        overflowY="auto"
                    >
                        <VStack align="start" spacing={8}>
                            {sampleItems.map((item, idx) => (
                                <Box key={idx} w="100%">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        color="gray.500"
                                        mb={4}
                                    >
                                        {item.label}
                                    </Text>
                                    <VStack align="start" spacing={3} pl={2}>
                                        {item.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.href}
                                                display="flex"
                                                alignItems="center"
                                                fontSize="md"
                                                color="gray.300"
                                                _hover={{ color: "white", textDecoration: "none" }}
                                                role="group"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (onFilterSelect && link.type && link.value) {
                                                        onFilterSelect(link.type, link.value);
                                                    }
                                                }}
                                            >
                                                <Box
                                                    as="span"
                                                    mr={2}
                                                    opacity={0}
                                                    transition="opacity 0.2s"
                                                    _groupHover={{ opacity: 1 }}
                                                >
                                                    <Icon as={link.icon || GoArrowUpRight} />
                                                </Box>
                                                {link.label}
                                            </Link>
                                        ))}
                                    </VStack>
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                </motion.div >
            )}
        </AnimatePresence >
    );
};

export default SideBar;
