// Declare globally on window so they can be accessed from other files if needed
let versionLink = document.getElementById("version");
let Version: any = {};

Version.number = "0.0";
Version.prefix = "v";

function versionLinkUpdate(){
	if (versionLink) {
		versionLink.innerHTML = Version.prefix + Version.number;
	}
}

function versionNumber(val){
	Version.number = val;
	versionLinkUpdate();
}

function versionPrefix(val){
	Version.prefix = val;
	versionLinkUpdate();
}

function setVersion(p,n){
	Version.prefix = p;
	Version.number = n;
	versionLinkUpdate();
}

if(versionLink && versionLink.tagName === "A"){
	versionLink.setAttribute("href","./changelog.txt");
}

versionLinkUpdate();

// Expose globally
Object.assign(window, {
	versionLink,
	Version,
	versionLinkUpdate,
	versionNumber,
	versionPrefix,
	setVersion
});
