import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react';
import { Button, Segment, Form } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';


export default observer(function ActivityForm() {

    const {activityStore} = useStore();
    const {selectedActivity, closeForm , createActivity, updateActivity, loading} = activityStore;

    var initialState =  {
        id: '',
        title: '',  // set default Value 
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    if(selectedActivity != undefined) // hs: 2022.03.24
    {
        initialState = selectedActivity;
    }    


    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        console.log("handleSubmit()");
        console.log(activity);
        activity.id ? updateActivity(activity) : createActivity(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    return (
        <>
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name="title" onChange={handleInputChange} />  
                <Form.TextArea placeholder='Description' value={activity.description} name="description" onChange={handleInputChange}  />  
                <Form.Input placeholder='Category' value={activity.category} name="category" onChange={handleInputChange}  />  
                <Form.Input type='date' placeholder='Date' value={activity.date} name="date" onChange={handleInputChange}  />  
                <Form.Input placeholder='City' value={activity.city} name="city" onChange={handleInputChange}  />  
                <Form.Input placeholder='Venue' value={activity.venue} name="venue" onChange={handleInputChange}  />  
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />           
            </Form>
        </Segment>
        </>

    );
})