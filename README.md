
Mume Music Player
Mume is a high-performance, modern Music Streaming and Offline Player application built with React Native. It features a seamless audio experience, centralized state management, and a robust local downloading system.

🛠 Tech Stack & Core Libraries
To ensure scalability and native-level performance, the following libraries were integrated:

Framework: React Native (Architecture optimized for 0.84)

Navigation: React Navigation (Stack & Tab integration)

State Management: Redux Toolkit & React-Native-Async-Storage (For persistent user data and session management)

Audio Engine: React-Native-Track-Player (The industry standard for background audio services)

UI/UX Components:

react-native-pager-view: Used for fluid, high-performance tab transitions.

@react-native-community/slider: Provides precise seekbar control for music playback.

react-native-safe-area-context: Handles notch and navigation bar spacing across all Android devices.

Networking: Axios with a centralized API Wrapper for token-based authentication and error handling.

File Management: React-Native-FS: Implemented for offline music downloading and local storage management.

🏗 Architecture
The app follows a Modular Clean Architecture to decouple business logic from the UI:

View Layer: Built with functional components and hooks. Each section (Songs, Artists, Albums) is decoupled to prevent unnecessary re-renders.

Service Layer (Headless JS): The audio playback logic runs in a dedicated background service via Track Player, ensuring music continues even when the app is minimized.

Data Layer: A centralized Axios utility (apiReq) handles all network requests, including automatic authorization header injection.

Persistent Storage: Combines Redux for runtime state and Async-Storage for long-term user preferences (like themes and tokens).

⚖ Technical Trade-offs & Decisions
PagerView vs. Standard ScrollViews: We chose react-native-pager-view over standard horizontal FlatLists to leverage native OS paging behavior, which significantly reduces "jank" during tab switching.

Offline First Approach: By using react-native-fs, the app allows users to download tracks. This involved a trade-off in storage management logic to ensure downloaded files are correctly mapped to the UI without internet access.

Centralized API Utility: Instead of calling Axios directly in components, we implemented a global wrapper. This ensures that if the baseUrl or token logic changes, it only needs to be updated in one file.

Slider Optimization: The playback slider uses a high-frequency update interval managed by the Track Player hooks to ensure the UI stays perfectly in sync with the audio buffer.

🚀 Setup & Installation
Clone the Repository:

Bash
git clone https://github.com/Devanshrathod12/Mume-Music-App
cd Mume
Install Dependencies:

Bash
npm install
Run on Android:

Bash
npx react-native run-android
Generate Production Build:

Bash
cd android
./gradlew assembleRelease
✨ Key Features
Dynamic Dashboard: Real-time trending songs and artist suggestions.

Professional Audio Controls: Full support for play/pause, seek, shuffle, and repeat.

Offline Downloader: Save your favorite tracks directly to your device storage.

Smart Sorting: Alphabetical sorting for large libraries of songs and albums.

Theme Engine: Seamless switching between Light and Dark modes via Context API.