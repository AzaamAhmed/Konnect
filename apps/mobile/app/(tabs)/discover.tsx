
import { StyleSheet, FlatList, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

export default function DiscoverScreen() {
    const [search, setSearch] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for collaborators..."
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.placeholder}>Map View coming soon...</Text>
                <Text style={styles.subtext}>Find nearby startups and developers</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#1A1A1A',
    },
    searchInput: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtext: {
        color: '#888',
        fontSize: 16,
    },
});
