import  { Fragment, useRef,useState } from "react";
import "./Note.css";
import {
  AppShell,
  Navbar,
  Button,
  Header,
  Footer,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { AiFillDelete } from "react-icons/ai";

interface NOTE {
  id: number;
  title: string;
  content: string;
}

export default function Note() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [addNote, setAddNote] = useState(false);
  const [updateCurrentNote, setUpdateCurrentNote] = useState(false);
  const [activeNote, setActiveNote] = useState(false);
  const [noteId, setNoteId] = useState(0);
  const [remove, setRemove] = useState(false);
  const titleFocus = useRef<HTMLInputElement>(null);
  const contentFocus = useRef<HTMLTextAreaElement>(null);
  const[noteArr,setNoteArr] = useState<NOTE[]>([]);

  //get Note from localStorage

  const checkNoteInfo = () => {
    let info = localStorage.getItem("noteInfo");
    if (info === null) {
      return [];
    }
    return JSON.parse(info);
  };

  setNoteArr(checkNoteInfo());

  //set Note to localStorage

  let setNoteToLocalStorage = () => {
    localStorage.setItem("noteInfo", JSON.stringify(noteArr));
  };

  //Add New Note

  const addNewNote = () => {
    if (titleValue.trim() == "" || contentValue == null) return;
    let id: number;
    if (noteArr.length <= 0) {
      id = 1;
    } else {
      id = noteArr[noteArr.length - 1].id + 1;
    }
    const newNote: NOTE = {
      id: id,
      title: titleValue,
      content: contentValue,
    };

    noteArr.push(newNote);
    setNoteToLocalStorage();
  };

  //submitHandler

  const submitHandler = (e: any) => {
    e.preventDefault();
    addNewNote();
    setTitleValue("");
    setContentValue("");
  };
  //   localStorage.clear()

  //Make inputs Not disable

  const makeInputNotDisable = () => {
    if(titleFocus.current){titleFocus.current.focus();}

    setAddNote(true);
   setOpened(false);
//    if(contentFocus.current){contentFocus.current.focus()}
   
   
   
  };

  //UpdateNote
  const takeNoteItemToInputToUpdate = (note: NOTE) => {
    if(titleFocus.current){titleFocus.current.focus();}
     setUpdateCurrentNote(true);
    setAddNote(true);
    setActiveNote(true);
    setOpened(false);
//    if(contentFocus.current){contentFocus.current.focus()}
   

    setContentValue(note.content);
    setTitleValue(note.title);
    setNoteId(note.id);
    console.log(note);
  };

  const UpdateNote = () => {
    noteArr.map((note: NOTE) => {
      if (note.id === noteId) {
        console.log("yes");
        note.title = titleValue;
        note.content = contentValue;
        setNoteToLocalStorage();
      }
    });
    setUpdateCurrentNote(false);
    setTitleValue("");
    setContentValue("");
};

  //RemoveNote
  const removeNote = (note: any) => {
    const index = noteArr.indexOf(note);
    if (index > -1) {
      // only splice array when item is found
      noteArr.splice(index, 1);
       // 2nd parameter means remove one item only
    }
   
    setNoteToLocalStorage();

    setRemove(true)

  };
 


  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 400 }}
        >
          <div className="addNote-container">
            <Button onClick={makeInputNotDisable} >Add New Note</Button>
            <div className="existing-note">
                {noteArr.length==0&&'No Note Available'}
              {noteArr.map((note: NOTE) => {
                return (
                  <Fragment key={note.id}>
                    <div
                      className="existing-note-item"
                    >
                      <div className="title-icon">
                        <h3>
                          {note.title.length <= 20
                            ? note.title
                            : `${note.title.slice(0, 20)}...`}
                        </h3>
                        <AiFillDelete
                          style={{ color: "red" }}
                          onClick={() => removeNote(note)}
                        />
                      </div>
                      <p onClick={() => takeNoteItemToInputToUpdate(note)}
>
                        {note.content.length <= 30
                          ? note.content
                          : `${note.content.slice(0, 30)}...`}
                      </p>
                      <span>
                        {new Date().toJSON().slice(0, 10).replace(/-/g, "/")}
                      </span>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          Developed By Eman Masoud 
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <h2>NOTE APP</h2>
          </div>
        </Header>
      }
    >
      <div className="preview-app-container">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Add a Note Title"
            required
            value={titleValue}
            ref={titleFocus}
            onChange={(e) => setTitleValue(e.target.value)}
            disabled={!addNote}
          />
          <textarea
            placeholder="Add a Note Content"
            required
            value={contentValue}
            ref={contentFocus}
            onChange={(e) => setContentValue(e.target.value)}
            disabled={!addNote}
            
          />
          <Button type="submit">Save Note</Button>
          <Button disabled={!updateCurrentNote} onClick={UpdateNote}>
            Update Note
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
