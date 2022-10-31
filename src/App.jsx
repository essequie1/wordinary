import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [word, setWord] = useState("");
  const [wordData, setWordData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  let URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  useEffect(() => {
    let fetchWord = async word => {
      await fetch(URL + word)
        .then(res => res.json())
        .then(data => {
          setWordData(data);
          // Set an Audio Array, because the API returns audio tracks in a weird way, so i gather every single one of them and pick the first one.
          // Also, some audio tracks are not provided, this also takes care of that.
          let audioArr = [];
          for (let i = 0; i < data[0].phonetics.length; i++) {
            audioArr.push(data[0].phonetics[i].audio);
          }

          audioArr = audioArr.filter(n => n);
          if (audioArr.length === 0) {
            document.getElementById("audio").src = "";
          } else {
            document.getElementById("audio").src = audioArr[0];
          }
          document.getElementById("wordInput").value = "";
        });
      if (wordData != []) {
        setIsLoaded(true);
      }
    };

    word && fetchWord(word);
  }, [word]);

  let wordSearch = useRef();

  let handleSearch = () => {
    // Defining DOM Elements as Variables
    let searchBox = document.getElementById("search");
    let titleBox = document.getElementById("title");
    let wordBox = document.getElementById("wordInput");
    let wordContainer = document.getElementById("word");
    let card = document.getElementById("card");

    // Set the word input as the word State
    setWord(wordBox.value);
    wordContainer.innerHTML = wordBox.value;

    // Calculating the word Length dividing it into an array of characters
    let wordLen = wordBox.value.split("").length;

    // Set the word input as the H2 in the HTML. + Adding and removing the "typewriter" effect
    document.documentElement.style.setProperty("--twchars", wordLen);
    document.documentElement.style.setProperty("--twspeed", wordLen / 8 + "s"); // This value is arbitrary, i just thought this amount of seconds looked fine
    wordContainer.classList.add("tw");
    card.classList.add("card-hide");
    setTimeout(function () {
      wordContainer.classList.remove("tw");
      card.classList.remove("card-show");
    }, (wordLen / 8) * 1000 * 2);

    // Adding and Removing the classes to the Wordinary "logo" and the searchbox, this is what reproduces an animation effect
    searchBox.classList.remove("no-word");
    searchBox.classList.add("with-word");
    titleBox.classList.remove("title-no-word");
    titleBox.classList.add("title-with-word");
  };

  let handlePlay = () => {
    document.getElementById("audio").play();
  };

  return (
    <div className="App">
      <div className="nav">
        <h1 id="title" className="title title-no-word">
          Wordinary
        </h1>
        <div id="search" className="searchbox no-word">
          <input className="search" type="text" name="word" ref={wordSearch} id="wordInput" onKeyDown={e => (e.key === "Enter" ? handleSearch() : undefined)} />
          <button className="searchIcon" onClick={handleSearch}></button>
        </div>
      </div>
      <main>
        <div className="word-container">
          <h2 id="word" className="word"></h2>
          <audio className="audio" id="audio" src="https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3"></audio>
          {word && <input type="button" id="audioBtn" className="audioBtn" onClick={handlePlay} />}
          <p className="country" id="country"></p>
        </div>
        {isLoaded ? (
          <>
            {<p className="pronunciation">{wordData[0].phonetic}</p>}
            {wordData.map((def, i) => (
              <div id="card" key={i} className="main-container">
                <p key={"speech"} className="speech">
                  {def.meanings[0].partOfSpeech}
                </p>
                {def.meanings[0].definitions.map((info, i) => (
                  <div key={"c" + i} className="definition-container">
                    <p className="definition" key={"info" + i}>
                      {i + 1}. {info.definition}
                    </p>
                    {info.example ? (
                      <p className="example" key={"e" + i}>
                        "{info.example}"
                      </p>
                    ) : (
                      <> </>
                    )}
                  </div>
                ))}

                <div className="syn-container">
                  {def.meanings[0].synonyms.length > 0 ? <p className="syn-title">Synonyms:</p> : <> </>}
                  <ul className="syn-list">
                    {def.meanings[0].synonyms.map((syn, i) => (
                      <li key={i} className="syn-list-item">
                        {syn}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </>
        ) : (
          <> </>
        )}
      </main>
    </div>
  );
}

export default App;
