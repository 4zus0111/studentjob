package com.azus.studentjob.service;

import com.azus.studentjob.dto.StudentRequest;
import com.azus.studentjob.entity.Student;
import com.azus.studentjob.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    // CREATE
    public Student create(StudentRequest request) {

        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        Student student = Student.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .university(request.getUniversity())
                .major(request.getMajor())
                .build();

        return studentRepository.save(student);
    }

    // READ ALL
    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    // READ ONE
    public Student getById(Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sinh viên với id = " + id
                        )
                );
    }

    // UPDATE
    public Student update(Long id, StudentRequest request) {

        Student student = getById(id);

        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setUniversity(request.getUniversity());
        student.setMajor(request.getMajor());

        return studentRepository.save(student);
    }

    // DELETE
    public void delete(Long id) {

        Student student = getById(id);

        studentRepository.delete(student);
    }
}