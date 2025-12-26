
import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';

const mockMessages = [
    { id: '1', sender: 'Alice Dev', lastMessage: 'Hey, saw your post about the AI startup!', time: '10:30 AM' },
    { id: '2', sender: 'Bob Founder', lastMessage: 'Are you available for a quick call?', time: 'Yesterday' },
];

export default function MessagesScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={mockMessages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.messageItem}>
                        <View style={styles.avatar} />
                        <View style={styles.messageContent}>
                            <View style={styles.messageHeader}>
                                <Text style={styles.sender}>{item.sender}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                            <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    messageItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#333',
        marginRight: 16,
    },
    messageContent: {
        flex: 1,
        justifyContent: 'center',
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    sender: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    time: {
        color: '#666',
        fontSize: 12,
    },
    lastMessage: {
        color: '#888',
        fontSize: 14,
    },
});
