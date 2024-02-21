import React from 'react';
import { Stack } from 'expo-router';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
            <Stack.Screen name="activity" options={{ headerShown: false }} />
        </Stack>
    );
}


export default Layout;
