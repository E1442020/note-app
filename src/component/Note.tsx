import { Fragment, useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { BsDot } from "react-icons/bs";
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
  const [updateCurrentNote, setUpdateCurrentNote] = useState(false);
  const [noteId, setNoteId] = useState(0);
  const [noteArr, setNoteArr] = useState<NOTE[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const [activeDot, setActiveDot] = useState(false);

  //get Note from localStorage

  const checkNoteInfo = () => {
    let info = localStorage.getItem("noteInfo");
    if (info === null) {
      return [];
    }
    return JSON.parse(info);
  };

  useEffect(() => {
    titleRef.current?.focus();
    setNoteArr(checkNoteInfo());
  }, []);

  //set Note to localStorage

  let setNoteToLocalStorage = (noteArray:NOTE[]) => {
    localStorage.setItem("noteInfo", JSON.stringify(noteArray));
  };
// setNoteToLocalStorage()
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
    setNoteToLocalStorage(noteArr);
    setActiveDot(true);
  };

  //submitHandler

  const submitHandler = (e: any) => {
    e.preventDefault();
    addNewNote();
    setTitleValue("");
    setContentValue("");
  };

  //delete All note

  const deleteAllNotes = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert these!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete them!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let newArr=[...noteArr]
          newArr=[];
          setNoteArr(() => [...newArr]);
          console.log(noteArr)
          setNoteToLocalStorage(newArr) ;
          setActiveDot(false);
          setOpened(true);
          setTitleValue("");
          setContentValue("");
          setUpdateCurrentNote(false);

          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your Notes have been deleted.",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary Notes are safe :)",
            "error"
          );
        }
      });
    setOpened(false);
  };

  //UpdateNote
  const takeNoteItemToInputToUpdate = (note: NOTE) => {
    titleRef.current?.focus();
    setUpdateCurrentNote(true);
    setOpened(false);
    setActiveDot(false);
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
        setNoteToLocalStorage(noteArr);
      }
    });
    setUpdateCurrentNote(false);
    setTitleValue("");
    setContentValue("");
  };

  //RemoveNote
  const removeNote = (note: any,e:any) => {
    e.stopPropagation();

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          setActiveDot(false);
          const newArr = [...noteArr];
          const index = newArr.indexOf(note);
          if (index > -1) {
            newArr.splice(index, 1);
            console.log(newArr);
            setNoteArr(() => [...newArr]);
            console.log(noteArr);
            setTitleValue("");
            setContentValue("");
            setUpdateCurrentNote(false);
            setNoteToLocalStorage(newArr);
            }
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your Note has been deleted.",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary Note is safe :)",
            "error"
          );
        }
      });

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
            <Button onClick={deleteAllNotes} disabled={noteArr.length == 0}>
              Delete All Notes
            </Button>
            <div className="existing-note">
              {noteArr.length == 0 && "No Note Available"}
              {noteArr.map((note: NOTE) => {
                return (
                  <Fragment key={note.id}>
                    <div className="existing-note-item" onClick={() => takeNoteItemToInputToUpdate(note)}>
                      <div className="title-icon">
                        <h3>
                          {note.title.length <= 20
                            ? note.title
                            : `${note.title.slice(0, 20)}...`}
                        </h3>
                        <AiFillDelete
                          style={{ color: "red" }}
                          size={22}
                          onClick={(e) => removeNote(note,e)}
                        />
                      </div>
                      <p >
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
            {activeDot && <BsDot size={30} style={{ color: "red" }} />}
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => {
                  setOpened((o) => !o);
                  setActiveDot(false);
                }}
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
            ref={titleRef}
            onChange={(e) => setTitleValue(e.target.value)}
          />
          <textarea
            placeholder="Add a Note Content"
            required
            value={contentValue}
            onChange={(e) => setContentValue(e.target.value)}
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
