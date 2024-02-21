import {Stack} from 'expo-router'
import store from '../context/store'
import {Provider} from 'react-redux'
import UsePushNotification from '../hooks/usePushNotification'

export default function Layout(){
    UsePushNotification();
    return (
        <Provider store={store}>
            <Stack>
                <Stack.Screen name="index" options={{headerShown:false}} />
                <Stack.Screen name="(drawer)" options={{headerShown:false}} />
                <Stack.Screen name="(authenticate)" options={{headerShown:false}} />
            </Stack>
        </Provider>
    )
}