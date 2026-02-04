import { extendTheme } from "@chakra-ui/react";
const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
}

const theme = extendTheme({
    config,
    styles: {
        global: (props: any) => ({
            body: {
                bg: props.colorMode === "dark" ? "black" : "white",
            }
        })
    }
})
export default theme
