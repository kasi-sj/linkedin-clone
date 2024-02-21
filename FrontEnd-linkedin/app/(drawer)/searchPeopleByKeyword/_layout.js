import React from 'react';
import { Stack } from 'expo-router';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="[keyword]" options={{ headerShown: false }} />
        </Stack>
    );
}


export default Layout;
