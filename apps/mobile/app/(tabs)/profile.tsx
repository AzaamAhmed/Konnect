
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { authAPI } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Mock user for now
        setUser({
            name: 'Demo User',
            role: 'Developer',
            bio: 'Full stack developer matched with AI startups.',
            skills: ['React Native', 'NestJS', 'TypeScript'],
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar} />
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.role}>{user?.role}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bio</Text>
                <Text style={styles.bio}>{user?.bio}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                    {user?.skills.map((skill: string, index: number) => (
                        <View key={index} style={styles.skillBadge}>
                            <Text style={styles.skillText}>{skill}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#333',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#8B4513',
    },
    name: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    role: {
        color: '#DEB887',
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    bio: {
        color: '#ccc',
        lineHeight: 22,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillBadge: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    skillText: {
        color: '#fff',
        fontSize: 14,
    },
    logoutButton: {
        backgroundColor: '#2A1A1A',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 'auto',
    },
    logoutText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
