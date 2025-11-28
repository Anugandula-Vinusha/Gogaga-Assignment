 ✈️ **Flight Search UI (Gogaga Assignment)**

A clean, interactive flight-search interface built with HTML, CSS, and Vanilla JavaScript, featuring dynamic flight selection, live summary updates, and an assistant-style sidebar.


**🚀 Features**

Return / One-way / Multi-city trip modes

Smart city swapping

Date pickers for departure & return

Traveller and class selectors

Real-time updating of route, dates, and total fare

Interactive flight cards (click to select)

Blue-highlighted selected outbound + return cards

Sidebar with filters (stops, time sliders, payment method, smart filters)

Assistant panel with travel recommendations

Fully responsive layout


**🧩 Tech Stack**

HTML5

CSS3 (custom responsive design, no frameworks)

JavaScript (ES6):

Dynamic rendering

Single-source app state

Runtime DOM construction

Event-driven UI updates

**
📁 Project Structure**
Gogaga/
│
├── index.html         # Main UI layout
├── styles.css         # All UI styling
├── script.js          # Application logic
└── README.md          # Project overview



**🧠 How It Works**

The UI is powered by a centralized appState object:

Updating any UI element triggers a full sync

Flights are generated dynamically using buildCard()

Selecting a radio button updates appState.selectedOutbound or selectedReturn

Summary recalculates instantly

Swapping cities updates UI + state

This approach keeps the app simple and reactive without frameworks.


**🚀 How to Run**

Just download the files and open index.html in any browser.

No installation is needed.


**🔧 Things I Want to Improve Later**

Add real airline logos

Add sorting and better filters

Add animations

Make it look more professional

Try connecting it to a real API someday
