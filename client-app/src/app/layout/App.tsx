import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity'
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';



function App() {
  const [activities, setActivities]  = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity]  = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
      //axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {   
      agent.Activities.list().then(response => {
        let activities: Activity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0];
          activities.push(activity);
        })
        // setActivities(response);
        setActivities(activities);
        setLoading(false);
    });
  }, []);

  function handleSelectActivity(id: string)
  {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectedActivity()
  {
    setSelectedActivity(undefined);
  }  


  function handleFormOpen(id?: string)
  {
    id ? handleSelectActivity(id) : handleCancelSelectedActivity();
    setEditMode(true);
  }  

  function handleFormClose()
  {
    setEditMode(false);
  }  


  function handleCreateOrEditActivity(activity: Activity)
  {
    setSubmitting(true);
    if(activity.id ) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string)
  {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false);
    });
  }

  console.log("pre  loading")
  if(loading)
  { 
    console.log("... in loading")
     return <LoadingComponent content='Loading app' />
  }
  console.log("post loading")

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          />
        </Container>
    </>
  );
}

export default App;
