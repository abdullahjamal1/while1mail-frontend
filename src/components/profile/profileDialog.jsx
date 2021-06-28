import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import EditIcon from "@material-ui/icons/Edit";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Fab from "@material-ui/core/Fab";
import LockIcon from "@material-ui/icons/Lock";
import SaveIcon from "@material-ui/icons/Save";

import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { updateUser, getLoggedUser } from "../../services/userService";
import { getCurrentUser } from "../../services/authService";

const schema = Joi.object({
  name: Joi.string().min(3).required(),
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  avatar_large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function ProfileList({ user, setUser }) {
  const classes = useStyles();
  const [nameEdit, setNameEdit] = React.useState(false);
  const [passwordEdit, setPasswordEdit] = React.useState(false);

  const [name, setName] = React.useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  useEffect(() => {
    async function loadUser() {
      const { _id } = getCurrentUser();
      const { data } = await getLoggedUser();
      setUser(data);
    }
    loadUser();
  }, []);

  //   const currentName = watch('name');

  const onSubmit = async () => {
    setNameEdit(false);
    const { data } = await updateUser(user._id, { name });
    setName(data.name);
  };

  const editName = () => {
    setNameEdit(true);
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const { ref, ...rest } = register("name");

  if (!user) return <div>Loading..</div>;

  return (
    <List className={classes.root}>
      <Grid item container direction="row" justify="space-between">
        <Grid item>
          <ListItem>
            {!nameEdit && (
              <>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Name" secondary={user.name} />
              </>
            )}
            {nameEdit && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  inputRef={ref}
                  {...rest}
                  id="name"
                  name="name"
                  value={name}
                  size="small"
                  style={{ maxWidth: 170 }}
                  onChange={handleName}
                  error={errors.name && 1}
                  helperText={errors.name && errors.name.message}
                />
              </form>
            )}
          </ListItem>
        </Grid>
        <Grid item>
          {!nameEdit && (
            <IconButton onClick={editName}>
              <EditIcon />
            </IconButton>
          )}
          {nameEdit && (
            <IconButton onClick={() => handleSubmit(onSubmit)()}>
              <SaveIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>

      <Grid item container direction="row" justify="space-between">
        <Grid item>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <LockIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Password" secondary="*******" />
          </ListItem>
        </Grid>
        <Grid item>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Grid item container direction="row" justify="space-between">
        <Grid item>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <EmailIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="E-mail address" secondary={user.email} />
          </ListItem>
        </Grid>
        <Grid item>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </List>
  );
}

export default function ProfileDialog({ open, handleClose }) {
  const classes = useStyles();

  const [user, setUser] = React.useState(null);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
      >
        <IconButton onClick={handleClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>

        <Container>
          <Grid container direction="column" alignItems="center" spacing={1}>
            <Grid item xs={6}>
              <DialogTitle id="form-dialog-title">Account</DialogTitle>
            </Grid>
            <Grid item xs={6}>
              <Avatar
                alt={user && user.name}
                src={user && user.avatar_url}
                className={classes.avatar_large}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                startIcon={<ImageIcon />}
                size="small"
                variant="contained"
                color="primary"
                margin="medium"
              >
                Choose..
              </Button>
            </Grid>
            <Grid item container direction="column">
              <ProfileList user={user} setUser={setUser} />
            </Grid>
          </Grid>
        </Container>

        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          /> */}
        </DialogContent>

        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
}
