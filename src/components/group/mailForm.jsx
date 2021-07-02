import React, { useEffect, useState, useRef } from "react";
import Form from "../common/form";
import { saveMail, getMail, updateMail } from "../../services/mailService";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import monthAndDays from "../../utils/monthsAndDays";
import Alert from "react-bootstrap/Alert";

import JoditEditor from "jodit-react";

// const mailSchema = Joi.object({
//   to: Joi.string().required(),
//   // cc: Joi.string(),
//   //   cc: Joi.array().items(Joi.string().min(5).max(255).required().email()),
//   //selector
//   subject: Joi.string(),
// });

const useStyles = makeStyles((theme) => ({
  textField_time: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    width: 100,
  },
}));

export default function MailForm(props) {
  console.log(monthAndDays);

  const classes = useStyles();
  const [month, setMonth] = useState(1);
  const [scheduled, setSchedule] = useState("recurring");
  const [time, setTime] = useState("07:00");
  const [weekDay, setWeekDay] = useState(1);
  const [monthDay, setMonthDay] = useState(1);
  const editor = useRef(null);
  let [body, setBody] = useState(
    '<p>Supports&nbsp;<strong>Bold,&nbsp;</strong><em>italics,&nbsp;</em><font color="#ff0000"><em><strong>colo</strong><span style="color: rgb(56, 118, 29);"><strong>red, <span style="background-color: rgb(255, 255, 255); font-family: Georgia, serif; color: rgb(255, 0, 255);">fonts and others</span></strong></span></em></font></p>'
  );
  let [to, setTo] = useState(null);
  let [cc, setCc] = useState(null);
  let [subject, setSubject] = useState(null);
  let [error, setError] = useState(null);

  const config = {
    readonly: false,
    height: 300,
  };

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   resolver: joiResolver(mailSchema),
  // });

  const schedules = ["recurring", "weekly", "monthly", "yearly"];
  const weekDays = [
    { value: 0, day: "Sunday" },
    { value: 1, day: "Monday" },
    { value: 2, day: "Tuesday" },
    { value: 3, day: "Wednesday" },
    { value: 4, day: "Thursday" },
    { value: 5, day: "Friday" },
    { value: 6, day: "Saturday" },
  ];

  const [monthDays, setMonthDays] = useState([]);

  useEffect(() => {
    populateMail();
    for (let i = 1; i <= 31; i++) {
      monthDays.push(i);
    }
    setMonthDays(monthDays);
  }, []);

  const setMail = (mail) => {
    console.log(mail);
    setTo(mail.to);
    setCc(mail.cc);
    setSubject(mail.subject);
    setBody(mail.body);
    const { scheduled, hour, minute, monthDay, month, weekDay } = mail.schedule;
    console.log(scheduled, hour, minute, monthDay, month, weekDay);
    setSchedule(mail.schedule.scheduled);
    let time = hour;
    time += ":";
    time += minute;
    setTime(time);
    setMonthDay(monthDay);
    setMonth(month);
    setWeekDay(weekDay);
  };

  async function populateMail() {
    try {
      const MailId = props.match.params.id;
      if (MailId === "new") return;
      const { data: mail } = await getMail(MailId);
      setMail(mail);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        props.history.replace("/not-found");
      if (ex.response) {
        setError(ex.response.data);
      }
    }
  }

  const onSubmit = async () => {
    const _id = props.match.params.id;

    let data = { to: to.toString(), cc: cc.toString(), body, subject };
    console.log(data);
    // data.to = data.to.trim();
    if (data.to) {
      data.to = data.to.split(",");
      data.to = data.to.map((d) => d.trim());
    }
    // data.cc = data.cc.trim();
    if (data.cc) {
      data.cc = data.cc.split(",");
      data.cc = data.cc.map((c) => c.trim());
    } else data.cc = [];

    const schedule = { scheduled, time, weekDay, monthDay, month };
    data = { data, schedule };

    try {
      if (_id === "new") {
        //post
        await saveMail(data);
      } else {
        //put
        await updateMail(_id, data);
      }
      props.history.replace("/mails");
    } catch (ex) {
      if (ex.response) {
        setError(ex.response.data);
        // setError(ex.response);
      }
    }
  };

  // const { ref: refTo } = register("to");
  // const { ref: refSubject } = register("subject");

  const handleUpdate = (event) => {
    setBody(event);
  };

  return (
    <Container>
      <form>
        <Grid container direction="column" spacing={2}>
          <Grid item container direction="row">
            <TextField
              style={{ maxWidth: 700 }}
              id="to"
              name="to"
              label="to :"
              fullWidth
              value={to}
              onChange={(event) => setTo(event.target.value)}
              helperText={"enter , separated emails"}
            />
          </Grid>
          <Grid item>
            <TextField
              id="cc"
              name="cc"
              label="CC :"
              fullWidth
              value={cc}
              onChange={(event) => setCc(event.target.value)}
              helperText={"enter , separated emails"}
            />
          </Grid>
          <Grid item>
            <TextField
              id="subject"
              name="subject"
              label="subject :"
              fullWidth
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={2}>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Schedule</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={scheduled}
                  onChange={(event) => setSchedule(event.target.value)}
                  style={{ width: 150, marginRight: 20 }}
                  required="true"
                >
                  {schedules.map((s) => (
                    <MenuItem value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {scheduled && scheduled === "yearly" && (
                <>
                  <FormControl>
                    <InputLabel id="month">Month</InputLabel>
                    <Select
                      labelId="month"
                      id="month"
                      value={month}
                      onChange={(event) => setMonth(event.target.value)}
                      style={{ width: 130, marginRight: 20 }}
                      required="true"
                    >
                      {monthAndDays.map((m) => (
                        <MenuItem value={m.value}>{m.month}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="monthDay">Day of month</InputLabel>
                    <Select
                      labelId="monthDay"
                      id="monthDay"
                      value={monthDay}
                      // inputRef={refScheduled}
                      onChange={(event) => setMonthDay(event.target.value)}
                      style={{ width: 130, marginRight: 20 }}
                      // error={errors.scheduled && 1}
                      required="true"
                    >
                      {monthAndDays[month - 1].days.map((d) => (
                        <MenuItem value={d}>{d}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {/* {errors.scheduled && errors.scheduled.message} */}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
              {scheduled && scheduled === "monthly" && (
                <FormControl>
                  <InputLabel id="monthDay">Day of month</InputLabel>
                  <Select
                    labelId="monthDay"
                    id="monthDay"
                    value={monthDay}
                    // inputRef={refScheduled}
                    onChange={(event) => setMonthDay(event.target.value)}
                    style={{ width: 130, marginRight: 20 }}
                    // error={errors.scheduled && 1}
                    required="true"
                  >
                    {monthDays.map((d) => (
                      <MenuItem value={d}>{d}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {/* {errors.scheduled && errors.scheduled.message} */}
                  </FormHelperText>
                </FormControl>
              )}

              {scheduled && scheduled === "weekly" && (
                <FormControl>
                  <InputLabel id="weekDay">Day of Week</InputLabel>
                  <Select
                    labelId="weekDay"
                    id="weekDay"
                    value={weekDay}
                    // inputRef={refScheduled}
                    onChange={(event) => setWeekDay(event.target.value)}
                    style={{ width: 150, marginRight: 20 }}
                  >
                    {weekDays.map((w) => (
                      <MenuItem value={w.value}>{w.day}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {/* {errors.scheduled && errors.scheduled.message} */}
                  </FormHelperText>
                </FormControl>
              )}

              {scheduled && scheduled !== "recurring" && (
                <form>
                  <TextField
                    id="time"
                    label="Select Time"
                    type="time"
                    defaultValue="07:30"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className={classes.textField_time}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                  <FormHelperText>click on clock icon</FormHelperText>
                </form>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <JoditEditor
              ref={editor}
              value={body}
              config={config}
              onBlur={handleUpdate}
              // onChange={(content) => console.log(content)}
            />
          </Grid>
          <Grid item>
            {error && (
              <Grid item>
                <Alert variant="danger">{error}</Alert>;
              </Grid>
            )}
            <Grid item>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                style={{ backgroundColor: "lightGreen" }}
                margin="medium"
                onClick={() => onSubmit()}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
