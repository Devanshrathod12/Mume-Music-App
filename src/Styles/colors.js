const commonColors = {
    Primary: "#FF5400",       
    lightornge: "#FF6B00",    
    White20: "#FFFFFF33",
    Black50: "rgba(0,0,0,0.5)", 
    BadgeRed: "#FF0000",
    HeartRed: "#E11D48",      
};

export const lightTheme = {
    ...commonColors,
    WhiteBackground: "#FFFFFF",
    MainBackground: "#F8FAFC",  
    CardBackground: "#F1F5F9", 
    HeadingColor: "#1E293B",    
    SecondaryText: "#64748B",   
    Black: "#0F172A",
    Separator: "#E2E8F0",
    Divider: "#F1F5F9",
    LightGray: "#F1F5F9",       
    TabBarBackground: "#FFFFFF",
    InactiveIcon: "#94A3B8",
    ActiveIcon: "#FF5400",
    MiniPlayerBackground: "#FFFFFF",
    MiniPlayerBorder: "#E2E8F0",
    ModalBackground: "#FFFFFF",
    Overlay: "rgba(0,0,0,0.4)",
};

export const darkTheme = {
    ...commonColors,
    WhiteBackground: "#0F172A", 
    MainBackground: "#020617",  
    CardBackground: "#1E293B", 
    HeadingColor: "#F1F5F9",    
    SecondaryText: "#94A3B8",   
    Black: "#FFFFFF",
    Separator: "#334155",
    Divider: "#334155",
    LightGray: "#1E293B",       
    TabBarBackground: "#0F172A",
    InactiveIcon: "#64748B",
    ActiveIcon: "#FF5400",
    MiniPlayerBackground: "#1E293B", 
    MiniPlayerBorder: "#334155",
    ModalBackground: "#1E293B",
    Overlay: "rgba(0,0,0,0.7)",
};

export default lightTheme;