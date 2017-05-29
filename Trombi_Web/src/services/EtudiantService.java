package services;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import filter.Secured;
import model.Etudiant;
import session.EtudiantSessionBeanRemote;

@RequestScoped
@Path("/student")
@Produces({ "application/json" })
@Consumes({ "application/json" })
public class EtudiantService {
	@EJB
	private EtudiantSessionBeanRemote etu;
	
	@GET
	@Path("{email}")
	@Secured
	public Response getStudent(@PathParam("email") String email) {
		Etudiant etudiant = null;
		try {
			etudiant = etu.getEtudiant(email);
		} catch(Exception e) { etudiant = new Etudiant(); }
		return Response.ok(etudiant).build();
	}
	
	@GET
	@Path("")
	@Secured
	public Response getStudents(@DefaultValue("") @QueryParam("nom") String nom, @DefaultValue("") @QueryParam("prenom") String prenom) {
		List<Etudiant> etudiant = new ArrayList<>();
		try {
			if(!(nom.isEmpty()) && prenom.isEmpty())
				etudiant.addAll(etu.searchEtudiant(prenom, nom));
			else
				etudiant.addAll(etu.getAllEtudiants());
		} catch(Exception e) { }
		return Response.ok(etudiant).build();
	}
}
