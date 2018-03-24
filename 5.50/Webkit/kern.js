var lsscrtch32 = new Uint32Array(0x400);
var lsscrtch = p.read8(p.leakval(lsscrtch32).add32(0x10));

/* no kernel exploit, yet! sorry :( */

//document.body.innerHTML += "<center id=kcent><h1><a href=javascript:kernexploit()>run kernel exploit</a></h1></center>"
window.ls = function(path)
{
    var sep = "/"
    if (path[path.length-1]=="/") sep = "";
    
    var fd = p.syscall("open", p.sptr(path), 0x1100004).low;
    if (fd == (-1 >>> 0))
    {
        print("open("+path+"): -1");
        return;
    }
    print("Directory listing for " +path+":");
    var total = p.syscall("getdents", fd, lsscrtch, 0x1000).low;
    if (total == (-1 >>> 0))
    {
        print("getdents("+path+"): -1");
        return;
    }
    
    var offset = 0;
    while (offset < total)
    {
        var cur = lsscrtch.add32(offset);
        var reclen = p.read4(cur.add32(4)) & 0xFFFF;
        var filepath = path + sep + p.readstr(cur.add32(8));
        print("<a href=javascript:window.ls('" + filepath + "');>" + filepath + "</a>");
        offset += reclen;
        if(!reclen) break;
    }
    p.syscall("close", fd);
}
print("<a href=javascript:window.ls('/');>ls /</a>");


