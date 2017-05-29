package services;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import filter.Secured;
import model.Edt;
import session.EdtSessionBeanRemote;

@RequestScoped
@Path("/edt")
@Produces({ "application/json" })
@Consumes({ "application/json" })
public class EdtService {
	@EJB
	private EdtSessionBeanRemote edt;
	
	@GET
	@Path("{email}")
	@Secured
	public Response getEdt(@PathParam("email") String email) {
		List<Edt> ins = new ArrayList<>();
		try {
			ins = edt.getEdt(email);
		} catch(Exception e) { }
		return Response.ok(ins).build();
	}
}
