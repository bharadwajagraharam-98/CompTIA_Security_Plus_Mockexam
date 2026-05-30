# CompTIA Security+ Mock Exam

An interactive web-based mock exam platform to help candidates prepare for the **CompTIA Security+ (SY0-701)** certification. Practice with realistic questions, track your progress, and identify weak areas before sitting the real exam.

![Security+ Mock Exam Banner](./screenshots/banner.png)

## 🎯 About

This project provides a free, accessible way to revise for the CompTIA Security+ certification. Questions are mapped to the official exam objectives across all five domains:

1. **General Security Concepts** (12%)
2. **Threats, Vulnerabilities, and Mitigations** (22%)
3. **Security Architecture** (18%)
4. **Security Operations** (28%)
5. **Security Program Management and Oversight** (20%)

## ✨ Features

- 📝 Large pool of practice questions covering all exam domains
- ⏱️ Timed exam mode that simulates real test conditions (90 minutes, up to 90 questions)
- 🎓 Practice mode with instant feedback and explanations
- 📊 Score breakdown by domain to highlight weak areas
- 🔁 Randomised question order and answer shuffling
- 💾 Progress saved locally in your browser
- 📱 Responsive design — works on desktop, tablet, and mobile
- 🌙 Light and dark theme support

## 🛠️ Tech Stack

> _Update this section with the actual technologies you used_

- **Frontend:** HTML5 / CSS3 / JavaScript (or React / Vue / etc.)
- **Styling:** Tailwind CSS / Bootstrap / custom CSS
- **Hosting:** GitHub Pages / Netlify / Vercel

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- _If applicable:_ Node.js v18+ and npm

### Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/security-plus-mock-exam.git
cd security-plus-mock-exam
```

**For a static site**, simply open `index.html` in your browser:

```bash
open index.html
```

**For a Node-based project**, install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:3000`.

## 📖 Usage

1. Open the site in your browser.
2. Choose between **Practice Mode** (instant feedback) or **Exam Mode** (timed, results at the end).
3. Select the number of questions and domains to focus on.
4. Answer the questions and submit when finished.
5. Review your results, see explanations, and identify areas to revise.

## 📸 Screenshots

> _Add screenshots of your app here_

| Home Page | Exam in Progress | Results Page |
|-----------|------------------|--------------|
| ![Home](./screenshots/home.png) | ![Exam](./screenshots/exam.png) | ![Results](./screenshots/results.png) |

## 🗂️ Project Structure

```
security-plus-mock-exam/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── questions.js
├── data/
│   └── questions.json
├── screenshots/
└── README.md
```

## 🤝 Contributing

Contributions are welcome! If you'd like to add questions, fix bugs, or improve the UI:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-questions`)
3. Commit your changes (`git commit -m 'Add new questions for Domain 3'`)
4. Push to the branch (`git push origin feature/new-questions`)
5. Open a Pull Request

### Adding Questions

Questions follow this JSON format:

```json
{
  "id": 1,
  "domain": "Threats, Vulnerabilities, and Mitigations",
  "question": "Which of the following best describes a zero-day vulnerability?",
  "options": [
    "A vulnerability that has been patched",
    "A vulnerability unknown to the vendor",
    "A vulnerability disclosed publicly",
    "A vulnerability in legacy software"
  ],
  "answer": 1,
  "explanation": "A zero-day vulnerability is one that is unknown to the vendor, meaning no patch exists at the time of discovery."
}
```

## ⚠️ Disclaimer

This is an **unofficial** study tool and is not affiliated with, endorsed by, or sponsored by CompTIA. "CompTIA" and "Security+" are trademarks of CompTIA. All questions are original practice material designed to reflect the style and difficulty of the exam, but do not represent actual exam content.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 📬 Contact

**<Your Name>**

- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-name](https://linkedin.com/in/your-name)
- Email: your.email@example.com

---

⭐ If you found this helpful, please consider giving the repo a star! Good luck on your Security+ exam! 🛡️
