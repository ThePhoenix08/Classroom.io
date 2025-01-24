package com.swapnil.Classroom.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.swapnil.Classroom.entity.Pathway;
import com.swapnil.Classroom.exception.PathwayNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class PathwayService {

    private final Firestore firestore;
    private final MailService mailService;

    public PathwayService(Firestore firestore, MailService mailService) {
        this.firestore = firestore;
        this.mailService = mailService;
    }

    public void createPathway(Pathway pathway) throws ExecutionException, InterruptedException {

        System.out.println("Pathway Id: " + pathway.getPathwayId());


        if (pathway.getPathwayId() == null) {
            firestore.collection("Pathway").add(pathway).get();
        } else {
            firestore.collection("Pathway").document(pathway.getPathwayId()).set(pathway).get();
        }
    }

    public List<Pathway> getPathwaysByUser(String userId) throws ExecutionException, InterruptedException {
        CollectionReference collectionReference = firestore.collection("Pathway");
        QuerySnapshot querySnapshot = collectionReference.whereEqualTo("userId", userId).get().get();

        List<Pathway> pathways = new ArrayList<>();
        querySnapshot.forEach(document -> {
            Pathway pathway = document.toObject(Pathway.class);
            pathways.add(pathway);
        });

        return pathways;
    }


    public void taskCompletionEmail(String pathwayId, Long taskId) {
        try {
            String userId = getUserIdFromPathwayId(pathwayId);

            String userEmail = getUserEmailByUserId(userId);

            Map<String, Object> taskDetails = getTaskFromPathway(pathwayId, taskId);



            boolean emailSent = (boolean) taskDetails.get("completionEmailSent");
            System.out.println("email status: "+ emailSent);
            if (!emailSent) {
                mailService.sendTaskCompletionEmail(taskDetails, userEmail, userId);

                updateTaskEmailSent(pathwayId, taskId, true);

                System.out.println("Task completion email sent and marked as sent in Firestore.");
            } else {
                System.out.println("Task completion email has already been sent.");
            }
        } catch (PathwayNotFoundException e) {
            System.err.println("Error: Pathway not found for pathwayId: " + pathwayId);
        } catch (ResourceAccessException e) {
            System.err.println("Error: Task not found for taskId: " + taskId);
        } catch (Exception e) {
            System.err.println("An unexpected error occurred: " + e.getMessage());
        }
    }




    private Map<String , Object> getTaskFromPathway(String pathwayId, Long taskId) throws Exception {

        DocumentReference documentReference = firestore.collection("Pathway").document(pathwayId);

        DocumentSnapshot pathwayDoc = documentReference.get().get();

        if (!pathwayDoc.exists()) {
            throw new PathwayNotFoundException("Pathway not found");
        }

        List<Map<String, Object>> pathways = (List<Map<String, Object>>) pathwayDoc.get("response.pathway");

        for (Map<String, Object> intervals : pathways){
            List<Map<String , Object>> tasks= (List<Map<String, Object>>) intervals.get("tasks");

            if(tasks!=null){

                for(Map<String , Object> task:tasks){

                    if(task.get("taskNumber").equals(taskId)){
                        return task;
                    }
                }
            }

        }
        throw new Exception("Task not found for taskId: " + taskId);


    }

    private String getUserEmailByUserId(String userId) throws Exception {
        DocumentReference userRef = firestore.collection("UserRegistration").document(userId);

        DocumentSnapshot userDoc = userRef.get().get();
        if (!userDoc.exists()) {
            throw new Exception("User not found for userId: " + userId);
        }
        return userDoc.getString("email");
    }


    public String getUserIdFromPathwayId(String pathwayId) throws Exception {

        DocumentReference documentReference= firestore.collection("Pathway").document(pathwayId);

        DocumentSnapshot document=documentReference.get().get();

        if(!document.exists()){
            throw new PathwayNotFoundException("Pathway not found");

        }

        String userId=document.getString("userId");
        if(userId==null){
            throw new Exception("UserId is missing in pathway");
        }

        return userId;
    }

    private void updateTaskEmailSent(String pathwayId, Long taskId, boolean emailSent) throws Exception {

        System.out.println("Updating the firebase...");
        DocumentReference pathwayRef = firestore.collection("Pathway").document(pathwayId);

        DocumentSnapshot document = pathwayRef.get().get();
        if (!document.exists()) {
            throw new Exception("Pathway not found for pathwayId: " + pathwayId);
        }

        List<Map<String, Object>> pathways = (List<Map<String, Object>>) document.get("response.pathway");
        boolean taskUpdated = false;

        for (Map<String, Object> interval : pathways) {
            List<Map<String, Object>> tasks = (List<Map<String, Object>>) interval.get("tasks");
            if (tasks != null) {
                for (Map<String, Object> task : tasks) {
                    if (task.get("taskNumber").equals(taskId)) {
                        task.put("completionEmailSent", emailSent);
                        taskUpdated = true;
                        break;
                    }
                }
            }
            if (taskUpdated) break;
        }

        if (!taskUpdated) {
            throw new Exception("Task not found to update emailSent field.");
        }

        ApiFuture<WriteResult> updateFuture = pathwayRef.update("response.pathway", pathways);
        updateFuture.get();  // Wait for the update to complete

    }

}
