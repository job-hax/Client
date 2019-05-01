import React from "react";
import classNames from "classnames";

import { fetchApi, postData } from "../../../../utils/api/fetch_api";
import {
  updateNoteRequest,
  addNoteRequest,
  deleteNoteRequest,
  getNotesRequest
} from "../../../../utils/api/requests.js";
import {
  IS_CONSOLE_LOG_OPEN,
  makeTimeBeautiful
} from "../../../../utils/constants/constants.js";

class Notes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotePad: false,
      isEditing: false,
      imageLoadError: true,
      whatIsDisplaying: "company",
      addNoteForm: "",
      updateNoteForm: "",
      notes: [],
      textareaHeight: 16
    };
    this.notes = [];
    this.currentNote = null;
    this.toggleNotes = this.toggleNotes.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.setToDefault = this.setToDefault.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addNote = this.addNote.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
  }

  componentDidMount() {
    this.getNotes();
  }

  getNotes() {
    const { card, token } = this.props;
    let { url, config } = getNotesRequest;
    url = url + "?jopapp_id=" + card.id;
    IS_CONSOLE_LOG_OPEN && console.log("URL with params\n", url);
    IS_CONSOLE_LOG_OPEN && console.log("token\n", token);
    config.headers.Authorization = token;
    fetchApi(url, config).then(response => {
      if (response.ok) {
        this.notes = response.json.data.reverse();
        IS_CONSOLE_LOG_OPEN &&
          console.log("getNotes.response.json.data\n", this.notes);
        this.setState({
          notes: this.notes
        });
      }
    });
  }

  toggleNotes() {
    this.currentNote = null;
    IS_CONSOLE_LOG_OPEN && console.log("current note\n", this.currentNote);
    this.setState(state => ({
      showNotePad: !state.showNotePad
    }));
  }

  toggleEdit() {
    this.setState(state => ({
      isEditing: !state.isEditing
    }));
  }

  setToDefault() {
    this.toggleEdit();
    var resetValue = this.refs.addNoteFormDefault;
    resetValue.value = "";
    this.setState({
      addNoteForm: ""
    });
  }

  setCurrentNote(item) {
    this.currentNote = item;
    IS_CONSOLE_LOG_OPEN && console.log("set current note\n", this.currentNote);
    this.setState(state => ({
      showNotePad: !state.showNotePad
    }));
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    IS_CONSOLE_LOG_OPEN && console.log("value", e.target.value);
  }

  handleKeyUp(evt) {
    if (this.state.textareaHeight != 64) {
      this.setState({
        textareaHeight: 64
      });
    } else {
      this.setState({
        textareaHeight: 28
      });
    }
  }

  addNote(e) {
    IS_CONSOLE_LOG_OPEN && console.log("add note requested!", e.target.value);
    e.preventDefault();
    const { card, token } = this.props;
    const { addNoteForm, updateNoteForm } = this.state;
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "addNote \n--add note form",
        addNoteForm,
        "\n--update note form",
        updateNoteForm,
        "\n--value",
        e.target.value
      );
    IS_CONSOLE_LOG_OPEN &&
      console.log("addnoteform currentNote", this.currentNote);
    if ((addNoteForm.trim().length == 0) & (updateNoteForm.trim().length == 0))
      return;
    const reqBody =
      this.currentNote == null
        ? {
            jobapp_id: card.id,
            description: addNoteForm
          }
        : {
            jobapp_note_id: this.currentNote.id,
            description: updateNoteForm
          };
    let { url, config } =
      this.currentNote == null ? addNoteRequest : updateNoteRequest;
    IS_CONSOLE_LOG_OPEN && console.log("request body\n", reqBody);
    config.headers.Authorization = token;
    postData(url, config, reqBody)
      .catch(error => console.error(error))
      .then(response => {
        IS_CONSOLE_LOG_OPEN && console.log("response json\n", response.json);
        if (response.ok) {
          this.saveNotes(response.json.data, reqBody, this.currentNote);
        }
      });
  }

  deleteNote(id) {
    const { token } = this.props;
    const body = {
      jobapp_note_id: id
    };
    let { url, config } = deleteNoteRequest;
    config.headers.Authorization = token;
    IS_CONSOLE_LOG_OPEN && console.log("delete request body\n", body);
    postData(url, config, body).then(response => {
      IS_CONSOLE_LOG_OPEN && console.log("delete request response\n", response);
      if (response.ok) {
        this.getNotes();
      }
    });
  }

  saveNotes(noteData, request, createdDate) {
    if (this.state.showNotePad) {
      const noteUpdated = {
        id: request.jobapp_note_id,
        description: request.description,
        created_date: createdDate.created_date,
        update_date: new Date(
          new Date().toString().split("GMT")[0] + " UTC"
        ).toISOString()
      };
      IS_CONSOLE_LOG_OPEN && console.log(noteUpdated);
      const notesUpdated = this.state.notes.filter(note => {
        return note.id !== request.jobapp_note_id;
      });
      notesUpdated.unshift(noteUpdated);
      this.setState(() => ({
        notes: notesUpdated
      }));
      this.toggleNotes();
      this.setState({
        updateNoteForm: ""
      });
    } else {
      let notesAdded = this.state.notes;
      notesAdded.unshift(noteData);
      this.setState(() => ({
        notes: notesAdded
      }));
      this.setToDefault();
    }
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "after save \n--addNoteForm",
        this.state.addNoteForm,
        "\n--updateNoteForm",
        this.state.updateNoteForm
      );
  }

  noteContainerGenerate() {
    let textareaStyle = {
      height: this.state.textareaHeight,
      maxWidth: "452px",
      minWidth: "452px",
      width: "452px"
    };
    IS_CONSOLE_LOG_OPEN &&
      console.log("notecontainergenerator currentNote?", this.currentNote);
    if (this.state.notes.length == 0) {
      return (
        <p style={{ color: "rgba(32,32,32,0.6)", marginTop: "16px" }}>
          You don't have any notes at the moment.
        </p>
      );
    } else {
      return this.state.notes.map(item => (
        <div key={item.id}>
          <div>
            {this.currentNote != item ? (
              <div className="note-container">
                <div
                  className="text-container"
                  value={item}
                  onClick={() => this.setCurrentNote(item)}
                >
                  <p className="note"> {item.description}</p>
                  {item.update_date == null ? (
                    <p className="date">
                      {" "}
                      {makeTimeBeautiful(item.created_date, "dateandtime")}
                    </p>
                  ) : (
                    <p className="date">
                      last updated{" "}
                      {makeTimeBeautiful(item.update_date, "dateandtime")}
                    </p>
                  )}
                </div>
                <div className="button-container-parent">
                  <div className="button-container-child">
                    <button
                      value={item.id}
                      onClick={() => this.deleteNote(item.id)}
                    >
                      <img src="../../src/assets/icons/DeleteIconInBtn@1x.png" />
                    </button>
                    <button
                      value={item}
                      onClick={() => this.setCurrentNote(item)}
                    >
                      <img src="../../src/assets/icons/edit.png" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                className="add-note-area"
                onSubmit={this.addNote}
                style={{ borderBottom: "1px solid rgba(32, 32, 32, 0.1)" }}
              >
                <div>
                  <textarea
                    name="updateNoteForm"
                    onChange={this.onChange}
                    defaultValue={item.description}
                    onDoubleClick={this.handleKeyUp.bind(this)}
                    style={textareaStyle}
                  />
                </div>
                <div className="notepad-buttons">
                  <button
                    className="notepad-buttons cancel"
                    type="reset"
                    onClick={this.toggleNotes}
                  >
                    cancel
                  </button>
                  <button className="notepad-buttons save" type="submit">
                    save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ));
    }
  }

  generateNotes() {
    const notesShowingClass = classNames({
      "notes-showing": true,
      "--short": this.state.isEditing
    });
    return (
      <div>
        <div>
          {this.state.isEditing ? (
            <form className="add-note-area" onSubmit={this.addNote}>
              <div>
                <textarea
                  name="addNoteForm"
                  placeholder="+ Add note"
                  onChange={this.onChange}
                  ref="addNoteFormDefault"
                />
              </div>
              <div className="notepad-buttons">
                <button
                  className="notepad-buttons cancel"
                  type="reset"
                  onClick={this.setToDefault}
                >
                  cancel
                </button>
                <button className="notepad-buttons save" type="submit">
                  save
                </button>
              </div>
            </form>
          ) : (
            <form className="add-note-area">
              <div>
                <textarea
                  className="add-note-area --height-min"
                  placeholder="+ Add note"
                  onClick={this.toggleEdit}
                  ref="addNoteFormDefault"
                />
              </div>
            </form>
          )}
          <div>
            <div className={notesShowingClass}>
              {this.noteContainerGenerate()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.generateNotes()} </div>;
  }
}

export default Notes;