package session;

import java.util.List;

import javax.ejb.Remote;

import model.Etudiant;

@Remote
public interface EtudiantSessionBeanRemote {
	Etudiant getEtudiant(String email);
	List<Etudiant> getAllEtudiants();
	List<Etudiant> searchEtudiant(String prenom, String nom);
}
