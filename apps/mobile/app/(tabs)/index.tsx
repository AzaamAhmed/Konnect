
import { StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { postsAPI } from '@/lib/api';
import { Link } from 'expo-router';

export default function TabOneScreen() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            // Mock data for initial render until API connects
            const response = await postsAPI.getAll();
            setPosts(response.data.posts);
        } catch (e) {
            console.log('Error loading posts', e);
            // Fallback dummy data
            setPosts([
                { id: '1', title: 'AI Attendance System', description: 'Looking for React Native dev', author: { name: 'John Doe' } },
                { id: '2', title: 'FinTech App', description: 'Need backend engineer', author: { name: 'Jane Smith' } },
            ] as any);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.avatarPlaceholder} />
                <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.author}>{item.author?.name}</Text>
                </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    author: {
        color: '#888',
        fontSize: 14,
    },
    description: {
        color: '#ccc',
        marginBottom: 16,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: '#8B4513',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
