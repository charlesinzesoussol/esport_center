import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for development (will be replaced with real data later)
const MOCK_STREAMS = [
  {
    id: '1',
    title: 'Ranked Climbing to Diamond - League of Legends',
    creator: 'ProGamer_2024',
    game: 'League of Legends',
    viewerCount: 2543,
    thumbnailUrl: 'https://via.placeholder.com/300x200/1a1a1a/00ff88?text=LoL',
    isLive: true,
  },
  {
    id: '2',
    title: 'Valorant Competitive - Road to Radiant',
    creator: 'EsportsLegend',
    game: 'Valorant',
    viewerCount: 1876,
    thumbnailUrl: 'https://via.placeholder.com/300x200/1a1a1a/ff6b6b?text=Valorant',
    isLive: true,
  },
  {
    id: '3',
    title: 'CS2 Faceit Level 10 Gameplay',
    creator: 'RankedClimber',
    game: 'Counter-Strike 2',
    viewerCount: 945,
    thumbnailUrl: 'https://via.placeholder.com/300x200/1a1a1a/4ecdc4?text=CS2',
    isLive: true,
  },
  {
    id: '4',
    title: 'Rocket League Tournament Highlights',
    creator: 'TournamentPro',
    game: 'Rocket League',
    viewerCount: 567,
    thumbnailUrl: 'https://via.placeholder.com/300x200/1a1a1a/45b7d1?text=RL',
    isLive: false,
  },
];

interface StreamCardProps {
  stream: typeof MOCK_STREAMS[0];
  onPress: () => void;
}

function StreamCard({ stream, onPress }: StreamCardProps) {
  return (
    <TouchableOpacity style={styles.streamCard} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnail}>
          <Text style={styles.thumbnailText}>{stream.game.slice(0, 3)}</Text>
        </View>
        {stream.isLive && (
          <View style={styles.liveIndicator}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>
      
      <View style={styles.streamInfo}>
        <Text style={styles.streamTitle} numberOfLines={2}>
          {stream.title}
        </Text>
        <Text style={styles.streamCreator}>{stream.creator}</Text>
        <View style={styles.streamMeta}>
          <Text style={styles.streamGame}>{stream.game}</Text>
          <View style={styles.viewerContainer}>
            <Ionicons name="eye" size={12} color="#666" />
            <Text style={styles.viewerCount}>
              {stream.viewerCount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function EsportScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [streams, setStreams] = useState(MOCK_STREAMS);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate network refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleStreamPress = (streamId: string) => {
    router.push(`/stream/${streamId}`);
  };

  const filteredStreams = streams.filter(stream =>
    stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStreamCard = ({ item }: { item: typeof MOCK_STREAMS[0] }) => (
    <StreamCard
      stream={item}
      onPress={() => handleStreamPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search streams, games, or creators"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredStreams}
        renderItem={renderStreamCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.streamList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00ff88"
            colors={['#00ff88']}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  streamList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  streamCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    height: 120,
  },
  thumbnail: {
    flex: 1,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
  },
  liveIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  streamInfo: {
    padding: 16,
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 22,
  },
  streamCreator: {
    fontSize: 14,
    color: '#00ff88',
    marginBottom: 8,
    fontWeight: '500',
  },
  streamMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streamGame: {
    fontSize: 12,
    color: '#cccccc',
  },
  viewerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerCount: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
});