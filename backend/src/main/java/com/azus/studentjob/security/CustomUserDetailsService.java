package com.azus.studentjob.security;

import com.azus.studentjob.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(CustomUserDetails::from)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /** Used by {@link JwtAuthFilter}: tokens carry the user id, and the DB is hit so locked users are cut off immediately. */
    @Transactional(readOnly = true)
    public Optional<CustomUserDetails> findById(Long id) {
        return userRepository.findById(id).map(CustomUserDetails::from);
    }
}
