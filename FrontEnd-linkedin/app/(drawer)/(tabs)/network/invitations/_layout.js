import { Stack } from "expo-router";

export default  function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerTitle : "Manage Your Network",
            }} />
            <Stack.Screen name="send/[id]"  options={{
                headerTitle : "Send"
            }}/>
            <Stack.Screen name="received/[id]" options={{
                headerTitle : "Received"
            }} />
            <Stack.Screen name="connections/[id]" options={{
                headerTitle : "Connections"
            }} />
        </Stack>
    );
}