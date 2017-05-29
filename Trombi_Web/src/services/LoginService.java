package services;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import java.security.Key;

import org.apache.commons.codec.digest.DigestUtils;

import model.Compte;
import session.LoginSessionBeanRemote;

@RequestScoped
@Path("/login")
@Produces(MediaType.TEXT_PLAIN)
public class LoginService {
	@EJB
	private LoginSessionBeanRemote loginSession;
	
	public static Key key = MacProvider.generateKey();
	
	@GET
	@Path("")
	public Response login(@QueryParam("login") String login, @DefaultValue("") @QueryParam("passwd") String passwd) {
		Compte compte = loginSession.getUser(login);
		if(compte == null) return Response.status(404).build();
		if(passwd.isEmpty() || !compte.getPassword().equals(DigestUtils.sha1Hex(passwd))) return Response.status(403).build();
	
		String compactJws = Jwts.builder()
		  .setSubject("admin")
		  .signWith(SignatureAlgorithm.HS512, key)
		  .compact();
		return Response.ok(compactJws).build();
	}
}
