package model;
// Generated 3 mai 2017 18:45:16 by Hibernate Tools 4.3.4.Final

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Branche implements java.io.Serializable {

	private String abreviation;
	private String nom;

	public Branche() {
	}

	public Branche(String abreviation) {
		this.abreviation = abreviation;
	}

	public Branche(String abreviation, String nom) {
		this.abreviation = abreviation;
		this.nom = nom;
	}

	@Id
	@Column(name = "abreviation", unique = true, nullable = false)
	public String getAbreviation() {
		return this.abreviation;
	}

	public void setAbreviation(String abreviation) {
		this.abreviation = abreviation;
	}

	@Column(name = "nom")
	public String getNom() {
		return this.nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}
}
