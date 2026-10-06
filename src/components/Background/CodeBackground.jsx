import "./CodeBackground.css";

const languages = [
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
];

const CodeBackground = () => {
  return (
    <div className="code-background">
      <div className="neon-grid" />

      {languages.map((language, index) => (
        <div
          className="floating-code"
          key={language.name}
          style={{
            "--x": `${10 + ((index * 23) % 85)}%`,
            "--y": `${8 + ((index * 37) % 82)}%`,
            "--duration": `${12 + (index % 6) * 2}s`,
            "--delay": `${index * -1.8}s`,
            "--move-x": `${-80 + (index % 5) * 40}px`,
            "--move-y": `${-100 + (index % 6) * 40}px`,
          }}
        >
          <div className="code-icon">
            <img src={language.icon} alt={language.name} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CodeBackground;