package model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Compte implements Serializable {
	private String pseudo;
	private String password;
	
	public Compte() {
	}

	public Compte(String pseudo, String password) {
		this.pseudo = pseudo;
		this.password = password;
	}

	@Id
	@Column(name = "pseudo", unique = true, nullable = false)
	public String getPseudo() {
		return pseudo;
	}

	public void setPseudo(String pseudo) {
		this.pseudo = pseudo;
	}

	@Column(name = "password")
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
