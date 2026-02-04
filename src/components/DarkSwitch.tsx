import { HStack, Switch, Text, useColorMode } from '@chakra-ui/react';

const DarkSwitch = () => {
    const { toggleColorMode, colorMode } = useColorMode();

    return (
        <HStack>
            <Switch
                colorScheme="green"
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
            />
        </HStack>
    );
};

export default DarkSwitch;
