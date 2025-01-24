package com.swapnil.Classroom.service;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;

import com.google.cloud.firestore.Firestore;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;
    private final Firestore firestore;

    public void sendEmail(String to, String title, String body) throws MessagingException {

        MimeMessage message=javaMailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(title);
        helper.setText(body);

        javaMailSender.send(message);
    }

    public void sendTaskCompletionEmail(Map<String, Object> task, String userEmail, String userId)  {

        try{

            if(userEmail==null){
                System.out.println("Email not found with userId: "+userEmail);
                return;
            }

            String username=userId;

            System.out.println("Sending task completion email...");
            String taskTitle= (String) task.get("taskTitle");
            String taskDesc=(String) task.get("description");

            String subject = "Task Completed: " + taskTitle;
            String body = "Dear "+username+"\n\nYour task " + taskTitle + "' has been marked as completed.\n\nDescription: " + taskDesc;

            System.out.println("Email is sent to: "+userEmail);
            sendEmail(userEmail, subject, body);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }


    }




//    private String getUserEmailFromFirebase(String userId) {
//        try {
//            // Query the UserRegistration collection by userId
//            ApiFuture<DocumentSnapshot> future = firestore.collection("UserRegistration").document(userId).get();
//            DocumentSnapshot document = future.get();
//
//            // Check if the document exists
//            if (document.exists()) {
//                // Return the email field from the document
//                return document.getString("email");
//            } else {
//                System.err.println("User not found in UserRegistration collection for userId: " + userId);
//                return null;
//            }
//        } catch (Exception e) {
//            System.err.println("Error fetching user email from Firestore: " + e.getMessage());
//            e.printStackTrace();
//            return null;
//        }
//    }



    public void sendTaskDeadlineEmail(String userEmail, Map<String, Object> task){

        try {

            if (userEmail == null) {
                System.out.println("Email not found with userEmail: " + userEmail);
                return;
            }


            String subject = "Task Deadline Reminder" ;
            String body= "Hello, \n\nYou have an upcoming deadline for the task: "
                    +task.get("taskTitle")+ ". The deadline is on "
                    +task.get("scheduledDate")
                    + ". Please complete it on time.\n\nThank You!";

            System.out.println("Email is sent to: "+userEmail);
            sendEmail(userEmail, subject, body);


        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }


}
