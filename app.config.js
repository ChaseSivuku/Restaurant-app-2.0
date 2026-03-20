export default {
  expo: {
    name: "Restaurant-app-2.0",
    slug: "Restaurant-app-2.0",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "restaurantapp20",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.restaurantapp20",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
    }
  }
};

