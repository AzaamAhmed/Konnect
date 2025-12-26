import { Text, View, useColorScheme } from 'react-native';

export function Text(props: Text['props']) {
    const style = { color: '#fff' };
    return <Text style={[style, props.style]} {...props} />;
}

export function View(props: View['props']) {
    const style = { backgroundColor: '#000' };
    return <View style={[style, props.style]} {...props} />;
}
