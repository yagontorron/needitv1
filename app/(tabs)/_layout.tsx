import { Tabs } from 'expo-router/tabs';
import {
  Chrome as Home,
  CirclePlus as PlusCircle,
  MessageCircle,
  User,
  Search,
} from 'lucide-react-native';
import { AppTheme } from '@/constants/theme';
import { Platform, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useMessages } from '@/contexts/MessagesContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
  const { getUnreadCount } = useMessages();
  const unreadCount = getUnreadCount();

  const renderTabBar = (props: BottomTabBarProps) => {
    return (
      <BlurView
        intensity={80}
        tint="light"
        style={{
          flexDirection: 'row',
          height: 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
          borderTopWidth: 1,
          borderTopColor: AppTheme.colors.border,
        }}
      >
        {props.state.routes.map((route, index) => {
          const { options } = props.descriptors[route.key];
          const isFocused = props.state.index === index;

          const onPress = () => {
            const event = props.navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              props.navigation.navigate(route.name);
            }
          };

          let iconComponent;
          if (route.name === 'index') {
            iconComponent = (
              <Home
                size={24}
                color={
                  isFocused
                    ? AppTheme.colors.primary
                    : AppTheme.colors.textLight
                }
              />
            );
          } else if (route.name === 'search') {
            iconComponent = (
              <Search
                size={24}
                color={
                  isFocused
                    ? AppTheme.colors.primary
                    : AppTheme.colors.textLight
                }
              />
            );
          } else if (route.name === 'create') {
            iconComponent = (
              <PlusCircle
                size={28}
                color={
                  isFocused
                    ? AppTheme.colors.primary
                    : AppTheme.colors.textLight
                }
              />
            );
          } else if (route.name === 'messages') {
            iconComponent = (
              <View>
                <MessageCircle
                  size={24}
                  color={
                    isFocused
                      ? AppTheme.colors.primary
                      : AppTheme.colors.textLight
                  }
                />
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      right: -6,
                      top: -6,
                      backgroundColor: AppTheme.colors.error,
                      borderRadius: 10,
                      minWidth: 18,
                      height: 18,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 10,
                        fontFamily: 'Inter-Bold',
                      }}
                    >
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          } else if (route.name === 'profile') {
            iconComponent = (
              <User
                size={24}
                color={
                  isFocused
                    ? AppTheme.colors.primary
                    : AppTheme.colors.textLight
                }
              />
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              {iconComponent}
              <Text
                style={{
                  fontSize: 10,
                  marginTop: 2,
                  fontFamily: 'Inter-Medium',
                  color: isFocused
                    ? AppTheme.colors.primary
                    : AppTheme.colors.textLight,
                }}
              >
                {options.title}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
      tabBar={renderTabBar}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="create" options={{ title: 'Post' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}