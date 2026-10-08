package com.azus.studentjob.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {

    @NotBlank(message = "Tên công việc không được để trống")
    @Size(max = 255, message = "Tên công việc tối đa 255 ký tự")
    private String title;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotBlank(message = "Tên doanh nghiệp không được để trống")
    private String companyName;

    @NotBlank(message = "Địa điểm không được để trống")
    private String location;

    @NotNull(message = "Lương không được để trống")
    @Positive(message = "Lương phải lớn hơn 0")
    private Double salary;

    @NotNull(message = "Hạn ứng tuyển không được để trống")
    @FutureOrPresent(message = "Hạn ứng tuyển phải từ hôm nay trở đi")
    private LocalDate deadline;
}